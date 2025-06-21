import OrdemVenda, { IOrdemVenda } from "../interface/ordem-venda";

export class OrdemVendaDao {
    async salvarOrdemVenda(dados: IOrdemVenda): Promise<IOrdemVenda> {
        const ordemVenda = new OrdemVenda(dados);
        return ordemVenda.save();
    }

    async obterTodas(): Promise<Array<IOrdemVenda>> {
        return OrdemVenda.find();
    }
}
