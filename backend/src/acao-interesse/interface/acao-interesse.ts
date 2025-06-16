import mongoose, { Schema, Document } from "mongoose";

export interface IAcaoInteresse extends Document {
    ticker: string;
    ordem: number;
}

const AcaoInteresseSchema = new Schema<IAcaoInteresse>({
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    ordem: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

AcaoInteresseSchema.set('toJSON', {
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

const AcaoInteresse =  mongoose.model<IAcaoInteresse>('AcaoInteresse', AcaoInteresseSchema);

export default AcaoInteresse