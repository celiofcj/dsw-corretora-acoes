import AcaoInteresse, {IAcaoInteresse} from "../model/AcaoInteresse";
import {Types} from "mongoose";

export class AcaoInteresseDao {
    async salvarAcaoInteresse(dados: IAcaoInteresse): Promise<IAcaoInteresse> {
        const acaoInteresse = new AcaoInteresse(dados)
        return acaoInteresse.save()
    }

    async obterTodas(userId: Types.ObjectId) : Promise<Array<IAcaoInteresse>> {
        return AcaoInteresse.find({usuario: userId}).sort({ordem: 1})
    }

    async obterUma(id: string, userId: Types.ObjectId) : Promise<IAcaoInteresse | null> {
        return AcaoInteresse.findOne({_id: id, usuario: userId})
    }

    async obterDoTicker(ticker: string, userId: Types.ObjectId) : Promise<IAcaoInteresse | null> {
        return AcaoInteresse.findOne({ticker, usuario: userId})
    }

    async obterDaOrdem(ordem: number, userId: Types.ObjectId): Promise<Array<IAcaoInteresse>> {
        return AcaoInteresse.find({ordem, usuario: userId})
    }

    async delete(id: string, userId: Types.ObjectId): Promise<IAcaoInteresse | null> {
        return AcaoInteresse.findOneAndDelete({_id: id, usuario: userId})
    }
}