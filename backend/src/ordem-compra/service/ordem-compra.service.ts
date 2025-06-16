import {IOrdemCompra} from "../interface/ordem-compra";
import {OrdemCompraDao} from "../dao/ordem-compra.dao";

export class OrdemCompraService{
    private ordemCompraDao = new OrdemCompraDao()

    async salvarOrdemCompra(ordemCompra : IOrdemCompra): Promise<IOrdemCompra> {
        return this.ordemCompraDao.salvarOrdemCompra(ordemCompra);
    }

    async obtemOrdensCompra() {
        return this.ordemCompraDao.obterTodas();
    }

    async executarOrdemCompra(id : string, ordemCompra : IOrdemCompra): Promise<IOrdemCompra> {
        return this.ordemCompraDao.executarOrdemCompra(id, ordemCompra);
    }
}