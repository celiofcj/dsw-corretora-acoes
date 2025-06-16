export class ErroValidacao extends Error{

    constructor(erros: Array<string>) {
        const message = erros.reduce((previousValue: string, currentValue: string) => {
            return `${previousValue}, ${currentValue}`;
        })
        super(message);
    }
}

export interface ErroValidacaoMessage{
    erro: string;
}