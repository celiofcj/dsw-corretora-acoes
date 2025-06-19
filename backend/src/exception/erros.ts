import {Error} from "mongoose";

export class ErroValidacao extends Error{

    constructor(erros: Array<string>) {
        const message = erros.reduce((previousValue: string, currentValue: string) => {
            return `${previousValue}, ${currentValue}`;
        })
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AutenticacaoError extends Error {
    constructor(msg: string) {
        super('');
    }
}

export interface ErroMessage {
    erro: string;
}