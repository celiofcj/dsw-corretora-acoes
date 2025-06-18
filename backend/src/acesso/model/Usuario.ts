import mongoose, {model, Schema, Document} from "mongoose";

export interface IUsuario extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    senha: string;
    falhasLogin: number;
    token: string | null;
    createdAt: Date;
    updatedAt: Date;
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
    }
}, {
    timestamps: true,
});

const Usuario = model<IUsuario>('Usuario', UsuarioAcessoSchema);

export default Usuario;