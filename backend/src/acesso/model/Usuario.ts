import {model, Schema, Document, Types} from "mongoose"

export interface ISenha {
    texto: string
    versao: number
}

export interface IUsuario extends Document {
    _id: Types.ObjectId
    email: string
    senha: ISenha
    falhasLogin: number
    token: string | null
    createdAt: Date
    updatedAt: Date
    acoesInteresse: Types.ObjectId[]
}

const SenhaSchema = new Schema<ISenha>({
    texto: {
        type: String,
        required: true,
    },
    versao:{
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false })

const UsuarioAcessoSchema = new Schema<IUsuario>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    senha: {
        type: SenhaSchema,
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