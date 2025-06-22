import {model, Schema, Types, Document} from "mongoose";

export interface IHoraNegociacao extends Document {
    horaNegociacao: string;
    usuario: Types.ObjectId
}

const HoraNegociacaoSchema = new Schema<IHoraNegociacao>({
    horaNegociacao: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: false
})

HoraNegociacaoSchema.set('toJSON', {
        virtuals: false,
        versionKey: false,
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
    });

const HoraNegociacao = model<IHoraNegociacao>('HoraNegociacao', HoraNegociacaoSchema)

export default HoraNegociacao