import OrdemVenda, { IOrdemVenda } from "../interface/ordem-venda";
import {Types} from "mongoose";
import usuario from "../../acesso/model/Usuario";

export class OrdemVendaDao {
    async salvarOrdemVenda(dados: IOrdemVenda): Promise<IOrdemVenda> {
        const ordemVenda = new OrdemVenda(dados);
        return ordemVenda.save();
    }

    async obterTodas(userId: Types.ObjectId): Promise<Array<IOrdemVenda>> {
        return OrdemVenda.find({usuario: userId});
    }
}
