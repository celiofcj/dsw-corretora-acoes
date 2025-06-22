export interface PedidoOrdemCompra {
    ticker: string
    quantidade: number
    preco: number
    executada?: boolean
    dataHora: Date
}