import UsuarioAcesso, {Acesso, IUsuarioAcesso} from "../interface/acesso.interface";

export class AcessoDao {
    async obterDoEmail(email: string) : Promise<Array<IUsuarioAcesso>> {
        return UsuarioAcesso.find({email: email})
    }

    async salvar(acesso: Acesso): Promise<IUsuarioAcesso> {
        const usuarioAcesso = new UsuarioAcesso(acesso);

        return usuarioAcesso.save()
    }

    async salvarUsuarioAcesso(dados: IUsuarioAcesso): Promise<IUsuarioAcesso> {
        const usuarioAcesso = new UsuarioAcesso(dados);

        return usuarioAcesso.save()
    }
}