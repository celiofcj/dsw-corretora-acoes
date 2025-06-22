import Carteira, {ICarteira} from "../model/Carteira";
import {Types} from "mongoose";
import {TransacaoAcao} from "../carteira.interface";

export class CarteiraDao {
    async obterTodas() : Promise<Array<ICarteira>> {
        return Carteira.find()
    }

    async obterDoTicker(ticker: string, userId: Types.ObjectId): Promise<ICarteira | null> {
        return Carteira.findOne({ticker, usuario: userId})
    }

    async salvar(carteira: ICarteira): Promise<ICarteira> {
        return await carteira.save()
    }

    async registrarTransacao(transacao: TransacaoAcao): Promise<ICarteira> {
        const carteira = new Carteira({
            ticker: transacao.ticker,
            precoCompra: transacao.valorUnitario,
            quantidade: transacao.quantidade,
            usuario: transacao.usuario
        })
        return carteira.save()
    }
}