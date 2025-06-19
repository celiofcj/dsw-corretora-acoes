import Usuario, {IUsuario} from "../model/Usuario";
import {DadosAcesso} from "../interface/acesso.interface";

export class AcessoDao {
    async findById(id: string): Promise<IUsuario | null> {
        return Usuario.findById(id)
    }

    async obterDoEmail(email: string) : Promise<Array<IUsuario>> {
        return Usuario.find({email: email})
    }

    async salvarComDadosAcesso(acesso: DadosAcesso): Promise<IUsuario> {
        const usuarioAcesso = new Usuario({email: acesso.email, senha: {texto: acesso.senha}});

        return usuarioAcesso.save()
    }

    async salvar(usuario: IUsuario): Promise<IUsuario> {
        return usuario.save()
    }
}