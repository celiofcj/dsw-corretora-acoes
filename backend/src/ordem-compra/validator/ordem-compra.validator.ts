import { IOrdemCompra } from "../model/OrdemCompra";
import { ErroValidacao } from "../../error/erros";

export function validarOrdemCompra(dados: IOrdemCompra) {
    const erros: string[] = [];

    if (!dados.ticker || dados.ticker.trim().length === 0) {
        erros.push("Ticker é obrigatório.");
    }

    if (dados.quantidade == null || dados.quantidade <= 0) {
        erros.push("Quantidade deve ser maior que 0.");
    }

    const executada = dados.executada

    if (executada) {
        if (dados.precoReferenciaCompra != null) {
            erros.push("Não deve conter preço de referência.");
        }

        if (dados.precoExecucao == null || dados.precoExecucao <= 0) {
            erros.push("Preço de execução é obrigatório e deve ser maior que 0 para ordens executadas.");
        }

        if (!dados.dataHoraExecucao) {
            erros.push("Data de execução é obrigatória para ordens executadas.");
        }
        // if (!dados.executada) {
        //     erros.push("Já deve ter sido executada.");
        // }

        return erros
    }


    if (dados.precoReferenciaCompra == null || dados.precoReferenciaCompra <= 0) {
        erros.push("Preço de referência inválido.");
    }

    // if (dados.precoExecucao != null && dados.precoExecucao <= 0) {
    //     erros.push("Preço de execução deve ser maior que 0.");
    // }


    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}