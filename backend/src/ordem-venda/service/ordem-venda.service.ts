import {fromPedidoVenda, IOrdemVenda} from "../model/ordem-venda";
import {OrdemVendaDao} from "../dao/ordem-venda.dao";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {UserData} from "../../security/UserData";
import {NotFoundError, TransacaoError} from "../../error/erros";
import {CarteiraService} from "../../carteira/service/CarteiraService";
import {TransacaoAcao} from "../../carteira/carteira.interface";
import {validarPedidoOrdemVenda} from "../validator/ordem-venda.validator";
import {PedidoExecucaoOrdemVenda, PedidoOrdemVenda} from "../interface/ordem-venda.interface";
import {validarPedidoExecucao} from "../../ordem-compra/validator/ordem-compra.validator";



export class OrdemVendaService {
    private ordemVendaDao = new OrdemVendaDao();
    private usuarioLogadoService = new UsuarioLogadoService();
    private carteiraService = new CarteiraService();

    async salvarOrdemVenda(pedido: PedidoOrdemVenda, userData: UserData): Promise<IOrdemVenda> {
        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return usuario
            })

        validarPedidoOrdemVenda(pedido);

        const ordemVenda = fromPedidoVenda(pedido, usuario._id);

        if(pedido.executada) {
            await this.executarVenda(ordemVenda)
        }

        return await this.ordemVendaDao.salvarOrdemVenda(ordemVenda);
    }

    async obtemOrdensVenda(userData: UserData) {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.ordemVendaDao.obterTodas(usuario._id);
            })
    }

    async executarOrdemVenda(id: string, dadosVenda: PedidoExecucaoOrdemVenda, userData: UserData): Promise<IOrdemVenda> {
        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return usuario
            })

        validarPedidoExecucao(dadosVenda)

        const ordemVenda = await this.ordemVendaDao.obterUma(id, usuario._id)
            .then(ordemVendaRegistrada => {
                if(!ordemVendaRegistrada) {
                    throw new NotFoundError(`Não há ordem de compra registrada com o id ${id}`)
                }

                if(ordemVendaRegistrada.executada) {
                    throw new TransacaoError(`A negociação com id ${id} já foi executada`)
                }

                ordemVendaRegistrada.executada = true
                ordemVendaRegistrada.precoExecucao = dadosVenda.preco
                ordemVendaRegistrada.dataHoraExecucao = dadosVenda.dataHora

                return ordemVendaRegistrada
            })

        await this.executarVenda(ordemVenda)

        return await this.ordemVendaDao.salvarOrdemVenda(ordemVenda)
    }

    private async executarVenda(ordemVenda: IOrdemVenda): Promise<void> {
        const transacaoAcao: TransacaoAcao = {
            ticker: ordemVenda.ticker,
            valorUnitario: ordemVenda.precoExecucao!!,
            quantidade: ordemVenda.quantidade,
            usuario: ordemVenda.usuario,
            dataHora: ordemVenda.dataHoraExecucao!!
        }

        await this.carteiraService.venderAcoes(transacaoAcao);
    }
}