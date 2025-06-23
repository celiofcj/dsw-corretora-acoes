import {Types} from "mongoose";

export interface TransacaoAcao {
    ticker: string
    valorUnitario: number
    quantidade: number
    usuario: Types.ObjectId
    dataHora: Date
}