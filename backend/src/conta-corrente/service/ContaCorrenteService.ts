interface Temp {
    valor: number,
    descricao: string,
    tipo: string
}

export class ContaCorrenteService {
    async registrarMovimentacao(temp: Temp) {
        console.log(temp)
    }
}