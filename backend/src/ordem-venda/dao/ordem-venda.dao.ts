import OrdemVenda, { IOrdemVenda } from "../interface/ordem-venda";

export class OrdemVendaDao {
    async salvarOrdemVenda(ordem: IOrdemVenda): Promise<IOrdemVenda> {
        const ordemVenda = new OrdemVenda(ordem);
        return ordemVenda.save();
    }

    async obterTodas(): Promise<IOrdemVenda[]> {
        return OrdemVenda.find();
    }
}