import {IOrdemVenda} from "../interface/ordem-venda";
import { OrdemVendaDao } from "../dao/ordem-venda.dao";
import OrdemCompra from "../../ordem-compra/model/OrdemCompra";
import {ErroValidacao} from "../../error/erros";


export class OrdemVendaService {
    private ordemVendaDao = new OrdemVendaDao();

    async salvarOrdemVenda(ordemVenda: IOrdemVenda): Promise<IOrdemVenda> {
        return this.ordemVendaDao.salvarOrdemVenda(ordemVenda);
    }

    async obtemOrdensVenda() {
        return this.ordemVendaDao.obterTodas();
    }

    async executarBaseadoEmCompra(idOrdemCompra: string, dadosVenda: { PrecoExecucao: number }): Promise<IOrdemVenda> {
        const compra = await OrdemCompra.findById(idOrdemCompra).exec();
        if (!compra) {
            throw new Error(`Ordem de compra com ID ${idOrdemCompra} não encontrada.`);
        }

        if (dadosVenda.PrecoExecucao == null || dadosVenda.PrecoExecucao <= 0) {
            throw new ErroValidacao(["Preço de execução da venda é obrigatório e deve ser maior que 0."]);
        }

        // TODO: Atualizar carteira (remover ações vendidas com base na ordem de compra)
        // await this.carteiraDao.subtrairQuantidade(compra.UsuarioID.toString(), compra.Ticker, compra.Quantidade);

        // TODO: Registrar movimentação de VENDA (entrada de dinheiro na conta)
        // const conta = await this.contaCorrenteDao.obterPorUsuario(compra.UsuarioID.toString());
        // const valorTotal = dadosVenda.PrecoExecucao * compra.Quantidade;
        // await this.movimentacaoDao.registrarVenda(conta._id.toString(), valorTotal, compra.Ticker);

        const novaOrdem: IOrdemVenda = {
            PrecoExecucao: dadosVenda.PrecoExecucao,
            DataHora: new Date(),
            Executada: true,
            DataHoraExecucao: new Date(),
            Modo: "IMEDIATO",
            Ticker: compra.ticker,
            Quantidade: compra.quantidade,
            UsuarioID: compra.usuario,
        } as IOrdemVenda;

        return this.ordemVendaDao.salvarOrdemVenda(novaOrdem);
    }
}