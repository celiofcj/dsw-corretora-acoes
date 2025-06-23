import mongoose, {Schema, Document, Types} from "mongoose";

export interface ICarteira extends Document {
    ticker: string;
    quantidade: number;
    precoCompra: number;
    quantidadeVendida?: number;
    precoVenda?: number;
    usuario: Types.ObjectId;
}

const CarteiraSchema = new Schema<ICarteira>({
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 0
    },
    precoCompra: {
        type: Number,
        required: true,
        min: 0
    },
    quantidadeVendida: {
        type: Number,
        min: 1
    },
    precoVenda: {
        type: Number,
        min: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Carteira = mongoose.model("Carteira", CarteiraSchema);

export default Carteira;