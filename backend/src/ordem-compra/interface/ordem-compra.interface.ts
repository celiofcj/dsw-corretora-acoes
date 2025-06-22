export interface PedidoOrdemCompra {
    ticker: string
    quantidade: number
    preco: number
    executada?: boolean
    dataHora: Date
}

export interface PedidoExecucaoOrdemCompra {
    preco: number
    dataHora: Date
}