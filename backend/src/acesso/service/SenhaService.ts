import bcrypt from "bcryptjs";
import {ISenha} from "../model/Usuario";

export class SenhaService {

    async validarSenha(senha: string, senhaUsuario: ISenha) : Promise<boolean> {
        return await bcrypt.compare(senha, senhaUsuario.texto)
    }

    async obterSenha(senha: string): Promise<string> {
        return await bcrypt.hash(senha, 10)
    }
}