import mongoose, { Schema, Document } from "mongoose";

export interface IOrdemCompra extends Document {
    DataHora : Date;
    Ticker : string;
    Quantidade : number;
    Modo : string;
    Executada : boolean;
    PrecoExecucao : number;
    PrecoReferenciaCompra : number;
    DataHoraExecucao : Date;

}

const OrdemCompraSchema = new Schema<IOrdemCompra>({
    DataHora: { type: Date, required: true },
    Ticker: { type: String, required: true },
    Quantidade: { type: Number, required: true },
    Modo: { type: String, required: true },
    Executada: { type: Boolean, required: true },
    PrecoExecucao: { type: Number, required: false },
    PrecoReferenciaCompra: { type: Number, required: false },
    DataHoraExecucao: { type: Date, required: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const OrdemCompra =  mongoose.model<IOrdemCompra>('OrdemCompra', OrdemCompraSchema);

export default OrdemCompra
