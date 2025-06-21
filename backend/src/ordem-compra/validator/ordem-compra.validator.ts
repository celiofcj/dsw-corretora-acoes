import { IOrdemCompra } from "../interface/ordem-compra";
import { ErroValidacao } from "../../error/erros";

export function validarOrdemCompra(dados: IOrdemCompra): void {
    const erros: string[] = [];

    if (!dados.Ticker || dados.Ticker.trim().length === 0) {
        erros.push("Ticker é obrigatório.");
    }

    if (dados.Quantidade == null || dados.Quantidade <= 0) {
        erros.push("Quantidade deve ser maior que 0.");
    }

    const modo = dados.Modo?.toUpperCase();
    if (!modo || !["AGENDADO", "IMEDIATO"].includes(modo)) {
        erros.push("Modo deve ser AGENDADO ou IMEDIATO.");
    }

    if (modo === "IMEDIATO") {
        if (dados.PrecoReferenciaCompra != null) {
            erros.push("Não deve conter preço de referência.");
        }
        if (!dados.Executada) {
            erros.push("Já deve ter sido executada.");
        }
    }

    if (modo === "AGENDADO") {
        if (dados.PrecoReferenciaCompra == null || dados.PrecoReferenciaCompra <= 0) {
            erros.push("Preço de referência inválido.");
        }
    }

    if (!dados.DataHora) {
        erros.push("DataHora é obrigatória.");
    }

    if (dados.PrecoExecucao != null && dados.PrecoExecucao <= 0) {
        erros.push("Preço de execução deve ser maior que 0.");
    }

    if (dados.Executada) {
        if (dados.PrecoExecucao == null || dados.PrecoExecucao <= 0) {
            erros.push("Preço de execução é obrigatório e deve ser maior que 0 para ordens executadas.");
        }

        if (!dados.DataHoraExecucao) {
            erros.push("Data de execução é obrigatória para ordens executadas.");
        }
    }

    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}