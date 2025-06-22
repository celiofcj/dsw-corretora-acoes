import { IOrdemVenda } from "../interface/ordem-venda";
import { ErroValidacao } from "../../error/erros";

export function validarOrdemVenda(dados: IOrdemVenda): void {
    const erros: string[] = [];

    if (!dados.ticker || dados.ticker.trim().length === 0) {
        erros.push("Ticker é obrigatório.");
    }

    if (dados.quantidade == null || dados.quantidade <= 0) {
        erros.push("Quantidade deve ser maior que 0.");
    }

    const modo = dados.modo?.toUpperCase();
    if (!modo || !["IMEDIATO", "AGENDADO"].includes(modo)) {
        erros.push("Modo deve ser IMEDIATO ou AGENDADO.");
    }

    if (modo === "IMEDIATO") {
        if (dados.precoReferenciaVenda != null) {
            erros.push("Não deve conter preço de referência.");
        }
        if (!dados.executada) {
            erros.push("Já deve ter sido executada.");
        }
    }

    if (modo === "AGENDADO") {
        if (dados.precoReferenciaVenda == null || dados.precoReferenciaVenda <= 0) {
            erros.push("Preço de referência inválido.");
        }
    }

    if (!dados.dataHora) {
        erros.push("DataHora é obrigatória.");
    }

    if (dados.precoExecucao != null && dados.precoExecucao <= 0) {
        erros.push("Preço de execução deve ser maior que 0.");
    }

    if (dados.executada) {
        if (dados.precoExecucao == null || dados.precoExecucao <= 0) {
            erros.push("Preço de execução é obrigatório e deve ser maior que 0 para ordens executadas.");
        }

        if (!dados.dataHoraExecucao) {
            erros.push("Data de execução é obrigatória para ordens executadas.");
        }
    }

    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}
