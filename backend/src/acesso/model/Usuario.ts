import {model, Schema, Document, Types} from "mongoose"

export interface IUsuario extends Document {
    _id: Types.ObjectId
    email: string
    senha: string
    falhasLogin: number
    token: string | null
    createdAt: Date
    updatedAt: Date
    acoesInteresse: Types.ObjectId[]
}

const UsuarioAcessoSchema = new Schema<IUsuario>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    senha: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
        sparse: true,
    },
    falhasLogin: {
        type: Number,
        required: true,
        default: 0
    },
    acoesInteresse: [{
        type: Schema.Types.ObjectId,
        ref: 'AcaoInteresse'
    }]
    
}, {
    timestamps: true,
})

const Usuario = model<IUsuario>('Usuario', UsuarioAcessoSchema)

export default Usuario