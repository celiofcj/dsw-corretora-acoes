import mongoose, {Schema, Document, Types} from "mongoose";

export interface IOrdemVenda extends Document {
    dataHora: Date;
    ticker: string;
    quantidade: number;
    modo: string;
    executada: boolean;
    precoExecucao: number;
    precoReferenciaVenda: number;
    dataHoraExecucao: Date;
    usuario: Types.ObjectId;
}

export interface IOrdemVendaExecucao {
    precoExecucao: number;
    quantidade?: number;
}

const OrdemVendaSchema = new Schema<IOrdemVenda>({
    dataHora: {
        type: Date,
        required: true
    },
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 1
    },
    modo: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    executada: {
        type: Boolean,
        required: true,
        default: false
    },
    precoExecucao: {
        type: Number,
        required: false,
        min: 0
    },
    precoReferenciaVenda: {
        type: Number,
        required: false,
        min: 0
    },
    dataHoraExecucao: {
        type: Date,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
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

