import AcaoInteresse, {IAcaoInteresse} from "../model/AcaoInteresse";
import {Types} from "mongoose";

export class AcaoInteresseDao {
    async salvarAcaoInteresse(dados: IAcaoInteresse): Promise<IAcaoInteresse> {
        const acaoInteresse = new AcaoInteresse(dados)
        return acaoInteresse.save()
    }

    async obterTodas(userId: Types.ObjectId) : Promise<Array<IAcaoInteresse>> {
        return AcaoInteresse.find({usuario: userId})
    }

    async obterUma(id: string, userId: Types.ObjectId) : Promise<IAcaoInteresse | null> {
        return AcaoInteresse.find({_id: id, usuario: userId})
            .then((acoes) => {
                if(acoes.length === 0) {
                    return null
                }

                return acoes[0]
            });
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