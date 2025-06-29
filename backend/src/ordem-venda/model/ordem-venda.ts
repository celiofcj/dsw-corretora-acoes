import mongoose, {Schema, Document, Types} from "mongoose";
import {PedidoOrdemVenda} from "../interface/ordem-venda.interface";


export interface IOrdemVenda extends Document {
    dataHora: Date;
    ticker: string;
    quantidade: number;
    executada: boolean;
    precoExecucao?: number;
    precoReferenciaVenda: number;
    dataHoraExecucao?: Date;
    usuario: Types.ObjectId;
}

export interface IOrdemVendaExecucao {
    precoExecucao: number;
    datahora: Date;
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

export function fromPedidoVenda (pedido: PedidoOrdemVenda, userId: Types.ObjectId): IOrdemVenda {
    return new OrdemVenda({
        ticker: pedido.ticker,
        quantidade: pedido.quantidade,
        executada: pedido.executada,
        dataHora: pedido.dataHora,
        precoReferenciaVenda: pedido.preco,
        dataHoraExecucao: pedido.executada ? pedido.dataHora : null,
        precoExecucao: pedido.executada ? pedido.preco : null,
        usuario: userId
    })
}

export default OrdemVenda;

