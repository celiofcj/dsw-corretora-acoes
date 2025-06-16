import mongoose, { Schema, Document } from "mongoose";

export interface IOrdemVenda extends Document {
    ticker: string;
    quantidade: number;
    modo: "agendado" | "imediato";
    precoReferencia: number;
    executada: boolean;

}

const OrdemVendaSchema = new Schema<IOrdemVenda>({
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    quantidade: {
        type: Number,
        required: true,
        default: 0
    },
    modo: {
        type: String,
        enum: ["agendado", "imediato"],
        required: true
    },
    precoReferencia: {
        type: Number,
        required: true,
        default: 0
    },
    executada: {
        type: Boolean,
        required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

OrdemVendaSchema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_, ret) => {
        // Se quiser a opção 1, só remova __v:
        // delete ret.__v;

        // Se quiser a opção 2, converta _id para id:
        ret.id = ret._id;
        delete ret._id;
    }
});

const OrdemVenda = mongoose.model<IOrdemVenda>("OrdemVenda", OrdemVendaSchema);

export default OrdemVenda;
