import {model, Schema, Types} from "mongoose";

export interface IContaCorrente {
    saldo: number
    usuario: Types.ObjectId
}

const ContaCorrenteSchema = new Schema<IContaCorrente> ({
    saldo: {
        type: Number,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
    }
})

ContaCorrenteSchema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const ContaCorrente =  model<IContaCorrente>('ContaCorrente', ContaCorrenteSchema);

export default ContaCorrente