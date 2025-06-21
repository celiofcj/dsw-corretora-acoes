import mongoose, { Schema, Document } from "mongoose";

export interface IOrdemVenda extends Document {
    DataHora: Date;
    Ticker: string;
    Quantidade: number;
    Modo: string; // "IMEDIATO" ou "ESPERA"
    Executada: boolean;
    PrecoExecucao?: number;
    PrecoReferenciaVenda?: number;
    DataHoraExecucao?: Date;
    UsuarioID: mongoose.Types.ObjectId;
}

export interface IOrdemVendaExecucao {
    PrecoExecucao: number
}

const OrdemVendaSchema = new Schema<IOrdemVenda>({
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
    PrecoReferenciaVenda: {
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

OrdemVendaSchema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const OrdemVenda = mongoose.model<IOrdemVenda>('OrdemVenda', OrdemVendaSchema);

export default OrdemVenda;

