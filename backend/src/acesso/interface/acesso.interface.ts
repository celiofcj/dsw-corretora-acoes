export interface DadosAcesso {
    email: string;
    senha: string
}

export interface Token {
    token: string;
}

export interface TrocaSenha {
    senha: string
}

export interface TokenNovaSenha {
    email: string
}

export interface RecuperarSenha {
    email: string
    token: string
    senha: string
}