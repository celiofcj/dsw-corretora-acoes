import {AcessoDao} from "../dao/acesso.dao";
import {UserData} from "../../security/UserData";
import {IUsuario} from "../model/Usuario";

export class UsuarioLogadoService {
    private acessoDao = new AcessoDao()

    async obterUsuarioLogado(userData: UserData): Promise<IUsuario> {
        return this.acessoDao.findById(userData.user_id)
            .then(usuario => {
                if(!usuario) {
                    throw new Error('Usuário logado não existe no banco de dados!')
                }

                return usuario
            })
    }
}