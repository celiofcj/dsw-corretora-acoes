import {AcessoDao} from "../dao/acesso.dao"
import {ErroValidacao, NotFoundError} from "../../error/erros"
import jwt from "jsonwebtoken";
import {DadosAcesso, TokenNovaSenha, Token, TrocaSenha, RecuperarSenha} from "../interface/acesso.interface";
import {SenhaService} from "./SenhaService";
import {UsuarioLogadoService} from "./UsuarioLogadoService";
import {UserData} from "../../security/UserData";
import {v4 as uuidv4} from 'uuid';
import {EmailService} from "../../misc/email/EmailService";

export class AcessoService {
    private acessoDao = new AcessoDao()
    private senhaService = new SenhaService()
    private usuarioLogadoService = new UsuarioLogadoService()
    private emailServicePromise = EmailService.createEmailService()

    async login(dados: DadosAcesso): Promise<Token> {
        if(dados == null) {
            throw new ErroValidacao(['Não pode ser vazio'])
        }

        const usuarioAcesso = await this.acessoDao.obterDoEmail(dados.email)
            .then((retorno) => {
                if (!retorno) {
                    throw new ErroValidacao(["Credenciais inválidas"])
                }

                return retorno
            })

        if (usuarioAcesso.falhasLogin >= 3) {
            throw new ErroValidacao(["Usuário bloqueado"])
        }

        const senhaCorreta = await this.senhaService.validarSenha(dados.senha, usuarioAcesso.senha)

        if(!senhaCorreta) {
            usuarioAcesso.falhasLogin++
            await this.acessoDao.salvar(usuarioAcesso)
            throw new ErroValidacao(["Credenciais inválidas"])
        }

        if (usuarioAcesso.falhasLogin != 0) {
            usuarioAcesso.falhasLogin = 0
            await this.acessoDao.salvar(usuarioAcesso)
        }

        const token = jwt.sign({ user_id: usuarioAcesso.id, email: usuarioAcesso.email, versaoSenha: usuarioAcesso.senha.versao }, 'aiusa7s8sdjm,d0-klaj', { expiresIn: "2h" })

        return {token}
    }

    async criarConta(dados: DadosAcesso): Promise<void> {
        if(dados == null) {
            throw new ErroValidacao(['Não pode ser vazio'])
        }

        let errosValidacao = this.validarFormatoEmail(dados.email)

        if(errosValidacao.length === 0) {
            const errosValidacaoUnicidade = await this.validarUnicidadeEmail(dados.email)
            errosValidacao = [...errosValidacao, ...errosValidacaoUnicidade]
        }

        const errosValidacaoSenha = this.senhaService.validarFormatoSenha(dados.senha)

        errosValidacao = [...errosValidacao, ...errosValidacaoSenha]

        if(errosValidacao.length > 0) {
            throw new ErroValidacao(errosValidacao)
        }

        const senhaCriptografa = await this.senhaService.obterSenha(dados.senha)

        const paraSalvar: DadosAcesso = {
            email: dados.email,
            senha: senhaCriptografa
        }
        const usuario = await this.acessoDao.salvarComDadosAcesso(paraSalvar)
        console.log(`Usuario registrado: ${usuario}`)
    }

    async trocarSenha(novaSenha: TrocaSenha, userData: UserData) {
        if(novaSenha == null) {
            throw new ErroValidacao(['Não pode ser vazio'])
        }

        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)

        const errosValidacaoSenha = this.senhaService.validarFormatoSenha(novaSenha.senha)

        if(errosValidacaoSenha.length > 0) {
            throw new ErroValidacao(errosValidacaoSenha)
        }

        return this.senhaService.atualizarSenha(novaSenha, usuario.senha)
            .then(senhaAtualizada => {
                usuario.senha = senhaAtualizada
                this.acessoDao.salvar(usuario)
            })
    }

    async tokenNovaSenha(body: TokenNovaSenha) {
        if(body == null) {
            throw new ErroValidacao(['Requisição não pode ser vazia'])
        }
        if(body.email == null) {
            throw new ErroValidacao(['Email não pode ser null'])
        }

        const usuario = await this.acessoDao.obterDoEmail(body.email)

        if(!usuario){
            return;
        }

        const codigoRecuperacao = uuidv4()

        usuario.codigoRecuperacaoSenha = codigoRecuperacao

        await this.acessoDao.salvar(usuario)

        const corpoEmail = `
            O código para recuperação de senha é: ${codigoRecuperacao}
        `

        const subject = 'Recuperação de senha'

        await this.emailServicePromise
            .then(emailService => {
                emailService.enviarEmail(usuario.email, subject, corpoEmail)
            })
    }

    async recuperarSenha(body: RecuperarSenha) : Promise<void> {
        if(body == null) {
            throw new ErroValidacao(['Não pode ser vazio'])
        }

        const usuario = await this.acessoDao.obterDoEmail(body.email)

        if(!usuario) {
            throw new NotFoundError('Não existe usuário com esse email')
        }

        if(!usuario.codigoRecuperacaoSenha || usuario.codigoRecuperacaoSenha !== body.token) {
            throw new ErroValidacao(['Codigo invalido'])
        }

        const errosValidacaoFormatoSenha = this.senhaService.validarFormatoSenha(body.senha)

        if(errosValidacaoFormatoSenha.length > 0) {
            throw new ErroValidacao(errosValidacaoFormatoSenha)
        }

        return this.senhaService.atualizarSenha({senha: body.senha}, usuario.senha)
            .then(senhaAtualizada => {
                usuario.codigoRecuperacaoSenha = null
                usuario.falhasLogin = 0
                usuario.senha = senhaAtualizada
                this.acessoDao.salvar(usuario)
            })
    }

    private validarFormatoEmail(email: string): Array<string> {
        const array = new Array<string>
        const regex = /^\S+@\S+\.\S+$/
        if(email == null) {
            array.push('Email não pode ser nulo')
            return array
        }

        if(!regex.test(email)){
            array.push('Formato do email é inválido')
        }

        return array
    }

    private async validarUnicidadeEmail(email: string) : Promise<Array<string>>{
        return this.acessoDao.obterDoEmail(email)
            .then((retorno) => {
                if(retorno){
                    return ['Email já está cadastrado']
                }

                return []
            })
    }
}