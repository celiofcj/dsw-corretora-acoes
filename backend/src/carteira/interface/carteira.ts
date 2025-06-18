import mongoose, {Schema, Document} from "mongoose";

export interface ICarteira {
    Ticker: string;
    Quantidade: number;
    PrecoCompra: number;
    UsuarioID: mongoose.Types.ObjectId;
}

const CarteiraSchema = new Schema<ICarteira>({
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
    PrecoCompra: {
        type: Number,
        required: false,
        min: 0
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
})

const Carteira = mongoose.model("Carteira", CarteiraSchema);

export default Carteira;