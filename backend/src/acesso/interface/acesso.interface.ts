import {model, Schema} from "mongoose";

export interface Acesso {
    email: string;
    senha: string;
}

export interface Token {
    token: string;
}

export interface IUsuarioAcesso extends Document, Acesso, Token {
    id: string;
    falhasLogin: number;
}

const UsuarioAcessoSchema = new Schema<IUsuarioAcesso>({
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
        required: false, // O token pode não estar presente em todos os momentos (e.g., antes do login)
        unique: true, // Se cada token deve ser único
        sparse: true, // Permite múltiplos documentos com token nulo se unique for true
    },
    // Adicione timestamps automaticamente para createdAt e updatedAt
}, {
    timestamps: true, // Isso adiciona `createdAt` e `updatedAt` automaticamente ao seu schema
});

const UsuarioAcesso = model<IUsuarioAcesso>('UsuarioAcesso', UsuarioAcessoSchema);

export default UsuarioAcesso;