export const TipoMovimentacaoInfo = {
    DEPOSITO: {
        id: 'DEPOSITO',
        operacao: 'entrada'
    },
    RETIRADA: {
        id: 'RETIRADA',
        operacao: 'saída'
    },
    COMPRA_ACOES: {
        id: 'COMPRA_ACOES',
        operacao: 'saída'
    },
    VENDA_ACOES: {
        id: 'VENDA_ACOES',
        operacao: 'entrada'
    }
} as const;

export type TipoMovimentacao = keyof typeof TipoMovimentacaoInfo;
export type TipoOperacao = typeof TipoMovimentacaoInfo[TipoMovimentacao]['operacao'];
export type TipoTransacaoId = typeof TipoMovimentacaoInfo[TipoMovimentacao]['id'];

export interface IMovimentacao {
    _id: string;
    valor: number;
    descricao: string;
    tipo: TipoTransacaoId;
    dataHora: Date;
}

export interface IContaCorrente {
    _id: string;
    saldo: number;
    usuario: string;
}