import {AcessoDao} from "../dao/acesso.dao";
import {UserData} from "../../security/UserData";
import {IUsuario} from "../model/Usuario";
import {AutenticacaoError} from "../../error/erros";

export class UsuarioLogadoService {
    private acessoDao = new AcessoDao()

    async obterUsuarioLogado(userData: UserData): Promise<IUsuario> {
        return this.acessoDao.findById(userData.user_id)
            .then(usuario => {
                if(!usuario) {
                    throw new AutenticacaoError('Usuário logado não existe no banco de dados!')
                }

                if(usuario.senha.versao !== userData.versaoSenha){
                    throw new AutenticacaoError('A versão da senha no token é incompatível com a versão da senha atual')
                }

                return usuario
            })
    }
}