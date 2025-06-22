import {IHoraNegociacao} from "../model/HoraNegociacao";
import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {HoraNegociacaoDao} from "../dao/HoraNegociacaoDao";
import {ErroValidacao, NotFoundError} from "../../error/erros";

export class NegociacaoService {
    private usuarioLogadoService = new UsuarioLogadoService()
    private horaNegociacaoDao = new HoraNegociacaoDao()

    async atualizarHoraNegociacao(horaAtualizacao: IHoraNegociacao, userData: UserData): Promise<IHoraNegociacao> {
        if(horaAtualizacao.horaNegociacao == null) {
            throw new ErroValidacao(['Hora não pode ser nula'])
        }

        if(!(/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/.test(horaAtualizacao.horaNegociacao))) {
            throw new ErroValidacao(['Horário inválido.'])
        }

        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                horaAtualizacao.usuario = usuario._id
                return this.horaNegociacaoDao.obter(horaAtualizacao.usuario)
            })
            .then(negociacaoSalva => {
                if(negociacaoSalva) {
                    negociacaoSalva.horaNegociacao = horaAtualizacao.horaNegociacao
                    return this.horaNegociacaoDao.save(negociacaoSalva)
                }

                return this.horaNegociacaoDao.save(horaAtualizacao)
            })
    }

    async obterHoraAtualizacao(userData: UserData): Promise<IHoraNegociacao> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.horaNegociacaoDao.obter(usuario._id)
            })
            .then(horaNegociacao => {
                if(!horaNegociacao) {
                    throw new NotFoundError('O usuário não possui hora de negociação registrada.')
                }

                return horaNegociacao
            })

    }
}