import mongoose, {Schema, Document, Types} from "mongoose";

export interface IMovimentacao extends Document {
    valor: number;
    descricao: string;
    tipo: string;
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
        uppercase: true
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