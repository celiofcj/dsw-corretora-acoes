import OrdemCompra, {IOrdemCompra} from "../interface/ordem-compra";

export class OrdemCompraDao {
    async salvarOrdemCompra(dados: IOrdemCompra): Promise<IOrdemCompra> {
        const ordemCompra = new OrdemCompra(dados)
        return ordemCompra.save()
    }

    async obterTodas() : Promise<Array<IOrdemCompra>> {
        return  OrdemCompra.find()
    }

    async executarOrdemCompra(id: string, dadosExecucao: IOrdemCompra): Promise<IOrdemCompra> {
        const atualizado = await OrdemCompra.findByIdAndUpdate(id, dadosExecucao, { new: true }).exec();
        if (!atualizado) {
            throw new Error(`Ordem de compra com id ${id} não encontrada.`);
        }
        return atualizado;
    }
}