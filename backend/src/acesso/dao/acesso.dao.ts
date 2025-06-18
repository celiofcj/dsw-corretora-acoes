import Usuario, {IUsuario} from "../model/Usuario";
import {DadosAcesso} from "../interface/acesso.interface";

export class AcessoDao {
    async obterDoEmail(email: string) : Promise<Array<IUsuario>> {
        return Usuario.find({email: email})
    }

    async salvarComDadosAcesso(acesso: DadosAcesso): Promise<IUsuario> {
        const usuarioAcesso = new Usuario(acesso);

        return usuarioAcesso.save()
    }
}