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
    UsuarioID: mongoose.Types.ObjectId;
}

const OrdemCompraSchema = new Schema<IOrdemCompra>({
    DataHora: {
        type: Date,
        required: true
    },
    Ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    Quantidade: {
        type: Number,
        required: true,
        min: 1
    },
    Modo: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    Executada: {
        type: Boolean,
        required: true,
        default: false
    },
    PrecoExecucao: {
        type: Number,
        required: false,
        min: 0
    },
    PrecoReferenciaCompra: {
        type: Number,
        required: false,
        min: 0
    },
    DataHoraExecucao: {
        type: Date,
        required: false
    },
    UsuarioID: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const OrdemCompra =  mongoose.model<IOrdemCompra>('OrdemCompra', OrdemCompraSchema);

export default OrdemCompra
