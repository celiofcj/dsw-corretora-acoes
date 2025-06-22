import OrdemCompra, {IOrdemCompra} from "../model/OrdemCompra";
import {Types} from "mongoose";

export class OrdemCompraDao {
    async salvarOrdemCompra(dados: IOrdemCompra): Promise<IOrdemCompra> {
        const ordemCompra = new OrdemCompra(dados)
        return ordemCompra.save()
    }

    async obterTodas(userId: Types.ObjectId) : Promise<Array<IOrdemCompra>> {
        return OrdemCompra.find({usuario: userId})
    }

    async obterUma(id: string, userId:Types.ObjectId) : Promise<IOrdemCompra | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return OrdemCompra.findOne({_id: id, usuario: userId})
    }
}