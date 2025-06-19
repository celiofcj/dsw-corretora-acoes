import {AcessoDao} from "../dao/acesso.dao"
import {ErroValidacao} from "../../exception/erros"
import jwt from "jsonwebtoken";
import {DadosAcesso, TrocaSenha, Token} from "../interface/acesso.interface";
import {SenhaService} from "./SenhaService";
import {UsuarioLogadoService} from "./UsuarioLogadoService";
import {UserData} from "../../security/UserData";

export class AcessoService {
    private acessoDao = new AcessoDao()
    private senhaService = new SenhaService()
    private usuarioLogadoService = new UsuarioLogadoService()

    async login(dados: DadosAcesso): Promise<Token> {
        const usuarioAcesso = await this.acessoDao.obterDoEmail(dados.email)
            .then((retorno) => {
                if (retorno.length === 0) {
                    throw new ErroValidacao(["Credenciais inválidas"])
                }

                return retorno[0]
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

    private validarFormatoEmail(email: string): Array<string> {
        const array = new Array<string>
        const regex = /^\S+@\S+\.\S+$/
        if(email === null) {
            array.push('Email não pode ser nulo')
        }

        if(!regex.test(email)){
            array.push('Formato do email é inválido')
        }

        return array
    }

    private async validarUnicidadeEmail(email: string) : Promise<Array<string>>{
        return this.acessoDao.obterDoEmail(email)
            .then((retorno) => {
                if(retorno.length >0){
                    return ['Email já está cadastrado']
                }

                return []
            })
    }

}