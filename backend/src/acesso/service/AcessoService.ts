import {AcessoDao} from "../dao/acesso.dao"
import {ErroValidacao} from "../../exception/erros"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import {DadosAcesso, Token} from "../interface/acesso.interface";

export class AcessoService {
    private acessoDao = new AcessoDao()

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

        const senhaCorreta = await bcrypt.compare(dados.senha, usuarioAcesso.senha)

        if(!senhaCorreta) {
            usuarioAcesso.falhasLogin++
            await this.acessoDao.salvarComDadosAcesso(usuarioAcesso)
            throw new ErroValidacao(["Credenciais inválidas"])
        }

        if (usuarioAcesso.falhasLogin != 0) {
            usuarioAcesso.falhasLogin = 0
            await this.acessoDao.salvarComDadosAcesso(usuarioAcesso)
        }

        const token = jwt.sign({ user_id: usuarioAcesso.id, email: usuarioAcesso.email }, 'aiusa7s8sdjm,d0-klaj', { expiresIn: "2h" })

        return {token}
    }

    async criarConta(dados: DadosAcesso): Promise<void> {
        let errosValidacao = this.validarFormatoEmail(dados.email)

        if(errosValidacao.length === 0) {
            const errosValidacaoUnicidade = await this.validarUnicidadeEmail(dados.email)
            errosValidacao = [...errosValidacao, ...errosValidacaoUnicidade]
        }

        const errosValidacaoSenha = this.validarFormatoSenha(dados.senha)

        errosValidacao = [...errosValidacao, ...errosValidacaoSenha]

        if(errosValidacao.length > 0) {
            throw new ErroValidacao(errosValidacao)
        }

        const senhaCriptografa = await bcrypt.hash(dados.senha, 10)

        const paraSalvar: DadosAcesso = {
            email: dados.email,
            senha: senhaCriptografa
        }

        const usuario = await this.acessoDao.salvarComDadosAcesso(paraSalvar)
        console.log(`Usuario registrado: ${usuario}`)
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

    private validarFormatoSenha(senha: string): Array<string> {
        const array = new Array<string>
        if(senha === null) {
            array.push('Senha não pode ser nula')
        }

        if (senha.length < 8) {
            array.push('Senha não pode ter menos de 8 caracteres')
        }

        if(!/.*[a-zA-Z].*$/.test(senha) && /.*[0-9].*$/.test(senha)) {
            array.push('Senha deve ter pelo menos uma letra e um número')
        }

        return array
    }
}