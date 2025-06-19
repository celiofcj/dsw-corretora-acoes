import bcrypt from "bcryptjs";
import {ISenha} from "../model/Usuario";
import {TrocaSenha} from "../interface/acesso.interface";

export class SenhaService {
    async validarSenha(senha: string, senhaUsuario: ISenha) : Promise<boolean> {
        return await bcrypt.compare(senha, senhaUsuario.texto)
    }

    async obterSenha(senha: string): Promise<string> {
        return await bcrypt.hash(senha, 10)
    }

    async atualizarSenha(novaSenha: TrocaSenha, senhaAtual: ISenha) : Promise<ISenha> {
        return this.obterSenha(novaSenha.senha)
            .then(senhaCriptografada => {
                const versao = senhaAtual.versao + 1

                return {
                    texto: senhaCriptografada,
                    versao
                }
            })
    }

    validarFormatoSenha(senha: string): Array<string> {
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