import { OrdemVendaDao } from "../dao/ordem-venda.dao";
import { IOrdemVenda } from "../interface/ordem-venda";

export class OrdemVendaService {
    private ordemVendaDao = new OrdemVendaDao()

    async criar(ordem: IOrdemVenda): Promise<IOrdemVenda> {
        return this.ordemVendaDao.salvarOrdemVenda(ordem);
    }

    async listar(): Promise<IOrdemVenda[]> {
        return this.ordemVendaDao.obterTodas();
    }
}
