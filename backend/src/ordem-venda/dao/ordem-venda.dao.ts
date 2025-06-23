import OrdemVenda, {IOrdemVenda} from "../model/ordem-venda";
import {Types} from "mongoose";

export class OrdemVendaDao {
    async salvarOrdemVenda(dados: IOrdemVenda): Promise<IOrdemVenda> {
        const ordemVenda = new OrdemVenda(dados);
        return ordemVenda.save();
    }

    async obterTodas(userId: Types.ObjectId): Promise<Array<IOrdemVenda>> {
        return OrdemVenda.find({usuario: userId});
    }

    async obterUma(id: string, userId:Types.ObjectId) : Promise<IOrdemVenda | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return OrdemVenda.findOne({_id: id, usuario: userId})
    }
}
