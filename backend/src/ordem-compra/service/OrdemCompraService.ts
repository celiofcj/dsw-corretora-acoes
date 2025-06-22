import {fromPedido, IOrdemCompra} from "../model/OrdemCompra";
import {OrdemCompraDao} from "../dao/ordem-compra.dao";
import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {validarPedidoExecucao, validarPedidoOrdemCompra} from "../validator/ordem-compra.validator";
import {CarteiraService} from "../../carteira/service/CarteiraService";
import {TransacaoAcao} from "../../carteira/carteira.interface";
import {PedidoExecucaoOrdemCompra, PedidoOrdemCompra} from "../interface/ordem-compra.interface";
import {TransacaoError, NotFoundError} from "../../error/erros";

export class OrdemCompraService{
    private ordemCompraDao = new OrdemCompraDao()
    private usuarioLogadoService = new UsuarioLogadoService()
    private carteiraService = new CarteiraService()

    async criarOrdemCompra(pedido : PedidoOrdemCompra, userData: UserData): Promise<IOrdemCompra> {
        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return usuario
            })

        validarPedidoOrdemCompra(pedido)

        const ordemCompra = fromPedido(pedido, usuario._id)

        console.log('Ordem compra:')
        console.log(ordemCompra)

        if(pedido.executada) {
            await this.executarCompra(ordemCompra)
        }

        return await this.ordemCompraDao.salvarOrdemCompra(ordemCompra)
    }

    async obtemOrdensCompra(userData: UserData) : Promise<Array<IOrdemCompra>> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.ordemCompraDao.obterTodas(usuario._id);
            })
    }

    async executarOrdemCompra(id : string, pedidoExecucao : PedidoExecucaoOrdemCompra, userData: UserData): Promise<IOrdemCompra> {
        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return usuario
            })

        validarPedidoExecucao(pedidoExecucao)

        const ordemCompra = await this.ordemCompraDao.obterUma(id, usuario._id)
            .then(ordemCompraRegistrada => {
                if(!ordemCompraRegistrada) {
                    throw new NotFoundError(`Não há ordem de compra registrada com o id ${id}`)
                }

                if(ordemCompraRegistrada.executada) {
                    throw new TransacaoError(`A negociação com id ${id} já foi executada`)
                }

                ordemCompraRegistrada.executada = true
                ordemCompraRegistrada.precoExecucao = pedidoExecucao.preco
                ordemCompraRegistrada.dataHoraExecucao = pedidoExecucao.dataHora

                return ordemCompraRegistrada
            })

        await this.executarCompra(ordemCompra)

        return await this.ordemCompraDao.salvarOrdemCompra(ordemCompra)
    }

    private async executarCompra(ordemCompra : IOrdemCompra): Promise<void> {
        const transacaoAcao: TransacaoAcao = {
            ticker: ordemCompra.ticker,
            valorUnitario: ordemCompra.precoExecucao!!,
            quantidade: ordemCompra.quantidade,
            usuario: ordemCompra.usuario
        }

        await this.carteiraService.comprarAcoes(transacaoAcao)
    }
}