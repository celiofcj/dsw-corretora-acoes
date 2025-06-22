import mongoose, {Schema, Document, Types} from "mongoose";

export interface IOrdemCompra extends Document {
    dataHora : Date;
    ticker : string;
    quantidade : number;
    executada : boolean;
    precoExecucao : number;
    precoReferenciaCompra : number;
    dataHoraExecucao : Date;
    usuario: Types.ObjectId;
}

const OrdemCompraSchema = new Schema<IOrdemCompra>({
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
    precoReferenciaCompra: {
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const OrdemCompra =  mongoose.model<IOrdemCompra>('OrdemCompra', OrdemCompraSchema);

export default OrdemCompra
