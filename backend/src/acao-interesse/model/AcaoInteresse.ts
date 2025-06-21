import {Schema, Document, Types, model} from "mongoose";

export interface IAcaoInteresse extends Document {
    ticker: string;
    ordem: number;
    usuario: Types.ObjectId
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
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

AcaoInteresseSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastAcaoInteresse = await (this.constructor as typeof AcaoInteresse)
                .findOne({ usuario: this.usuario })
                .sort({ ordem: -1 })
                .limit(1);

            if (lastAcaoInteresse) {
                this.ordem = lastAcaoInteresse.ordem + 1;
            } else {
                this.ordem = 0;
            }
            next();
        } catch (error: any) {
            next(error);
        }
    } else {
        next();
    }
});

AcaoInteresseSchema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const AcaoInteresse =  model<IAcaoInteresse>('AcaoInteresse', AcaoInteresseSchema);

export default AcaoInteresse