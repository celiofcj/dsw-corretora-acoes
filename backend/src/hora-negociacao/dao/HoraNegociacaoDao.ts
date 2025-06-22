import HoraNegociacao, {IHoraNegociacao} from "../model/HoraNegociacao";
import {Types} from "mongoose";

export class HoraNegociacaoDao {
    async save(horaNegociacao: IHoraNegociacao): Promise<IHoraNegociacao> {
        const toSave = new HoraNegociacao(horaNegociacao)
        return toSave.save()
    }

    async obter(userId: Types.ObjectId): Promise<IHoraNegociacao | null> {
        return HoraNegociacao.findOne({usuario: userId})
    }
}