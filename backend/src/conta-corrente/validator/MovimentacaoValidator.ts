import {PedidoOrdemCompra} from "../../ordem-compra/interface/ordem-compra.interface";
import {ErroValidacao} from "../../error/erros";
import {IMovimentacao} from "../model/Movimentacao";

export function validarMovimentacao(dados: IMovimentacao){
    const erros: string[] = [];

    if (dados.descricao == null || dados.descricao.trim().length === 0) {
        erros.push("Descrição é obrigatório.");
    }

    if (dados.valor == null || dados.valor <= 0) {
        erros.push("Valor é obrigatório e deve ser maior que 0.");
    }

    if (dados.dataHora == null) {
        erros.push("Data e hora é obrigatória.");
    }

    if (erros.length > 0) {
        throw new ErroValidacao(erros);
    }
}