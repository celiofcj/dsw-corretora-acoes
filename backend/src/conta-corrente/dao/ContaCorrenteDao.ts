import Movimentacao, { IMovimentacao } from "../model/Movimentacao";
import {Types} from "mongoose";
import ContaCorrente, {IContaCorrente} from "../model/ContaCorrente";

export class ContaCorrenteDao {
    async salvarMovimentacao(dados: IMovimentacao): Promise<IMovimentacao> {
        const nova = new Movimentacao(dados);
        return nova.save();
    }

    async obterTodasMovimentacoes(userId: Types.ObjectId) : Promise<Array<IMovimentacao>> {
        return Movimentacao.find({usuario: userId})
    }

    async obterConta(userId: Types.ObjectId) : Promise<IContaCorrente | null> {
        return ContaCorrente.findOne({usuario: userId});
    }

    async salvarConta(dados: IContaCorrente): Promise<IContaCorrente> {
        const nova = new ContaCorrente(dados);
        return nova.save();
    }
}
