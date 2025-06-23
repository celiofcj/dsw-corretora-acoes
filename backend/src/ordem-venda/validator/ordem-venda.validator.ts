import { ErroValidacao } from "../../error/erros";
import {PedidoExecucaoOrdemVenda, PedidoOrdemVenda} from "../interface/ordem-venda.interface";

export function validarPedidoOrdemVenda(dados: PedidoOrdemVenda){
    const erros: string[] = [];

    if (dados.ticker == null || dados.ticker.trim().length === 0) {
        erros.push("Ticker é obrigatório.");
    }

    if (dados.quantidade == null || dados.quantidade <= 0) {
        erros.push("Quantidade deve ser maior que 0.");
    }

    if (dados.preco == null || dados.preco <= 0) {
        erros.push("Preço é obrigatório e deve ser maior que 0.");
    }

    if(dados.executada == null) {
        erros.push("Executada é obrigatório")
    }

    if (dados.dataHora == null) {
        erros.push("Data e hora é obrigatória.");
    }

    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}

export function validarPedidoExecucao(dados: PedidoExecucaoOrdemVenda) {
    const erros: string[] = [];

    if (dados.dataHora == null) {
        erros.push("Data e hora é obrigatória.");
    }

    if (dados.preco == null || dados.preco <= 0) {
        erros.push("Preço é obrigatório e deve ser maior que 0.");
    }

    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}
