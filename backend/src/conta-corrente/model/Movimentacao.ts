import mongoose, {Schema, Document, Types} from "mongoose";

export const TipoMovimentacaoInfo = {
    DEPOSITO: {
        id: 'DEPOSITO',
        operacao: 'entrada'
    },
    RETIRADA: {
        id: 'RETIRADA',
        operacao: 'saída'
    },
    COMPRA_ACOES: {
        id: 'COMPRA_ACOES',
        operacao: 'saída'
    },
    VENDA_ACOES: {
        id: 'VENDA_ACOES',
        operacao: 'entrada'
    }
} as const;

export type TipoMovimentacao = keyof typeof TipoMovimentacaoInfo;
export type TipoOperacao = typeof TipoMovimentacaoInfo[TipoMovimentacao]['operacao'];
export type TipoTransacaoId = typeof TipoMovimentacaoInfo[TipoMovimentacao]['id'];

export interface IMovimentacao extends Document {
    valor: number;
    descricao: string;
    tipo: TipoTransacaoId;
    dataHora: Date;
    usuario: Types.ObjectId;
}

const MovimentacaoSchema = new Schema<IMovimentacao>({
    valor: {
        type: Number,
        required: true,
        min: 0.01
    },
    descricao: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        uppercase: true,
        enum: Object.values(TipoMovimentacaoInfo).map(info => info.id)
    },
    dataHora: {
        type: Date,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

MovimentacaoSchema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Movimentacao = mongoose.model<IMovimentacao>("Movimentacao", MovimentacaoSchema);
export default Movimentacao;