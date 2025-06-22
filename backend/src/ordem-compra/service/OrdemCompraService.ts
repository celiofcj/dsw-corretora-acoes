import {IOrdemCompra} from "../model/OrdemCompra";
import {OrdemCompraDao} from "../dao/ordem-compra.dao";
import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {validarOrdemCompra} from "../validator/ordem-compra.validator";
import {CarteiraService} from "../../carteira/service/CarteiraService";
import {TransacaoAcao} from "../../carteira/carteira.interface";

export class OrdemCompraService{
    private ordemCompraDao = new OrdemCompraDao()
    private usuarioLogadoService = new UsuarioLogadoService()
    private carteiraService = new CarteiraService()

    async criarOrdemCompra(ordemCompra : IOrdemCompra, userData: UserData): Promise<IOrdemCompra> {
        validarOrdemCompra(ordemCompra)

        await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                ordemCompra.usuario = usuario._id
                return usuario
            })

        if(ordemCompra.executada) {
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

    async executarOrdemCompra(id : string, ordemCompra : IOrdemCompra, userData: UserData): Promise<IOrdemCompra> {
        return this.ordemCompraDao.executarOrdemCompra(id, ordemCompra);
    }

    private async executarCompra(ordemCompra : IOrdemCompra): Promise<void> {
        const transacaoAcao: TransacaoAcao = {
            ticker: ordemCompra.ticker,
            valorUnitario: ordemCompra.precoExecucao,
            quantidade: ordemCompra.quantidade,
            usuario: ordemCompra.usuario
        }

        await this.carteiraService.comprarAcoes(transacaoAcao)
    }
}