export interface PedidoOrdemVenda {
    ticker: string
    quantidade: number
    preco: number
    executada?: boolean
    dataHora: Date
}

export interface PedidoExecucaoOrdemVenda {
    preco: number
    dataHora: Date
}