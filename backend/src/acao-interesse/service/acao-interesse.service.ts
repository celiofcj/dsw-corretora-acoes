import {IAcaoInteresse} from "../interface/AcaoInteresse"
import {AcaoInteresseDao} from "../dao/acao-interesse.dao"
import {UserData} from "../../security/UserData"
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {NotFoundError} from "../../exception/erros";

export class AcaoInteresseService {
    private acaoInteresseDao = new AcaoInteresseDao()
    private usuarioLogadoService = new UsuarioLogadoService()

    async salvarAcaoInteresse(acaoInteresse: IAcaoInteresse, userData: UserData): Promise<IAcaoInteresse> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                acaoInteresse.usuario = usuario._id
                return this.acaoInteresseDao.salvarAcaoInteresse(acaoInteresse)
            })
    }

    async obtemAcoesInteresse(userData: UserData) {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.acaoInteresseDao.obterTodas(usuario._id)
            })
    }

    async removerAcaoInteresse(id: string, userData: UserData): Promise<void> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then((usuario) => {
                this.acaoInteresseDao.delete(id, usuario._id)
            })
    }

    async subirAcaoInteresse(id: string, userData: UserData) {
        const acaoInteresse = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then((usuario) => {
                return this.acaoInteresseDao.obterUma(id, usuario._id)
            }).then((resultado) => {
                    if (resultado === null) {
                        throw new NotFoundError(`Não existe ação de interesse com o id:${id} especificado`)
                    }

                    if (resultado.ordem == 0) {
                        throw new Error(`A ação com id:${id} já na ordem mínima`)
                    }
                    return resultado
                }
            )

        const ordemParaTrocar = acaoInteresse.ordem - 1
        return this.trocarOrdem(acaoInteresse, ordemParaTrocar)
    }

    async descerAcaoInteresse(id: string, userData: UserData) {
        const acaoInteresse = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then((usuario) => {
                return this.acaoInteresseDao.obterUma(id, usuario._id)
            }).then((resultado) => {
                    if (resultado === null) {
                        throw new NotFoundError(`Não existe ação de interesse com o id:${id} especificado`)
                    }
                    return resultado
                }
            )

        const ordemParaTrocar = acaoInteresse.ordem + 1
        return this.trocarOrdem(acaoInteresse, ordemParaTrocar)
    }

    private async trocarOrdem(acaoInteresse: IAcaoInteresse, target: number) {
        if(target < 0) {
            throw new Error(`Ordem não pode ser negativa!`)
        }

        const ordemOriginal = acaoInteresse.ordem

        if(ordemOriginal === target) {
            throw new Error(`Ordem não pode ser igual à original!`)
        }

        const acaoParaTrocar = await this.acaoInteresseDao.obterDaOrdem(target, acaoInteresse.usuario)
            .then((resultado) => {
                if(resultado.length === 0) {
                    throw new Error(`Não existe ação com a ordem:${target}. Operação para o id:${acaoInteresse.id}`)
                }

                if(resultado.length > 1) {
                    throw new Error(`A busca pela ação de interesse de ordem:${target} retornou mais de um resultado. Operação para o id:${acaoInteresse.id}`)
                }

                return resultado[0]
            })

        acaoParaTrocar.ordem = -1
        return this.acaoInteresseDao.salvarAcaoInteresse(acaoParaTrocar)
            .then(() => {
                acaoInteresse.ordem = target
                return this.acaoInteresseDao.salvarAcaoInteresse(acaoInteresse)
            })
            .then((acaoAtualizada) => {
                acaoParaTrocar.ordem = ordemOriginal
                this.acaoInteresseDao.salvarAcaoInteresse(acaoParaTrocar)
                return acaoAtualizada
            })
    }
}