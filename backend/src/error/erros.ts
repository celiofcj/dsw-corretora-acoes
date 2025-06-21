import {Response} from "express"
import {ErrorMessage} from "./ErrorMessage";

export abstract class ResponsibleError extends Error {
    abstract response(res: Response): Response<ErrorMessage>
}

export class ErroValidacao extends ResponsibleError {
    private readonly erros: Array<String>

    constructor(erros: Array<string>) {
        const message = erros.reduce((previousValue: string, currentValue: string) => {
            return `${previousValue}, ${currentValue}`;
        })
        super(message);
        this.erros = erros
    }

    response(res: Response): Response<ErrorMessage> {
        return res.status(400).json({erros: this.erros})
    }
}

export class NotFoundError extends ResponsibleError {
    constructor(message: string) {
        super(message);
    }

    response(res: Response): Response<ErrorMessage> {
        return res.status(404).json({erros: [this.message]})
    }
}

export class AutenticacaoError extends ResponsibleError {
    constructor(message: string) {
        super(message);
    }

    response(res: Response): Response<ErrorMessage> {
        return res.status(401).send()
    }
}

