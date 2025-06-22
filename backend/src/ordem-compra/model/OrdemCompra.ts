import mongoose, {Document, Schema, Types} from "mongoose";
import {PedidoOrdemCompra} from "../interface/ordem-compra.interface";

export interface IOrdemCompra extends Document {
    ticker : string;
    quantidade : number;
    executada: boolean;
    dataHora : Date;
    precoReferenciaCompra: number;
    dataHoraExecucao?: Date;
    precoExecucao?: number;
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

export function fromPedido (pedido: PedidoOrdemCompra, userId: Types.ObjectId): IOrdemCompra {
    return new OrdemCompra({
        ticker: pedido.ticker,
        quantidade: pedido.quantidade,
        executada: pedido.executada,
        dataHora: pedido.dataHora,
        precoReferenciaCompra: pedido.preco,
        dataHoraExecucao: pedido.executada ? pedido.dataHora : null,
        precoExecucao: pedido.executada ? pedido.preco : null,
        usuario: userId
    })
}

export default OrdemCompra
