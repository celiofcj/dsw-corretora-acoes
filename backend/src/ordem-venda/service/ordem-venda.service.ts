import {IOrdemVenda, IOrdemVendaExecucao} from "../interface/ordem-venda";
import { OrdemVendaDao } from "../dao/ordem-venda.dao";
import {OrdemCompraDao} from "../../ordem-compra/dao/ordem-compra.dao";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {UserData} from "../../security/UserData";
import {ErroValidacao, TransacaoError} from "../../error/erros";
import {CarteiraService} from "../../carteira/service/CarteiraService";
import {TransacaoAcao} from "../../carteira/carteira.interface";


export class OrdemVendaService {
    private ordemVendaDao = new OrdemVendaDao();
    private ordemCompraDao = new OrdemCompraDao()
    private usuarioLogadoService = new UsuarioLogadoService();
    private carteiraService = new CarteiraService();

    async salvarOrdemVenda(ordemVenda: IOrdemVenda, userData: UserData): Promise<IOrdemVenda> {
        await this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                ordemVenda.usuario = usuario._id
                return usuario
            })

        if(ordemVenda.executada){
            await this.executarVenda(ordemVenda);
        }

        return await this.ordemVendaDao.salvarOrdemVenda(ordemVenda);
    }

    async obtemOrdensVenda(userData: UserData) {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.ordemVendaDao.obterTodas(usuario._id);
            })
    }

    async executarBaseadoEmCompra(idOrdemCompra: string, dadosVenda: IOrdemVendaExecucao, userData: UserData): Promise<IOrdemVenda> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(async usuario => {
                const compra = await this.ordemCompraDao.obterUma(idOrdemCompra, usuario._id)
                if (!compra) {
                    throw new Error(`Ordem de compra com ID ${idOrdemCompra} não encontrada.`);
                }

                if (!compra.usuario.equals(usuario._id)) {
                    throw new Error("Você não tem permissão para executar essa ordem.");
                }

                if(!compra.executada) {
                    throw new TransacaoError(`A negociação com id ${idOrdemCompra} ainda não foi executada`)
                }

                const quantidadeVenda = dadosVenda.quantidade ?? compra.quantidade;

                if (quantidadeVenda > compra.quantidade) {
                    throw new ErroValidacao(["Não é possível vender mais ações do que possui"]);
                }

                const novaOrdem: IOrdemVenda = {
                    precoExecucao: dadosVenda.precoExecucao,
                    dataHora: new Date(),
                    executada: true,
                    dataHoraExecucao: new Date(),
                    modo: "IMEDIATO",
                    ticker: compra.ticker,
                    quantidade: quantidadeVenda,
                    usuario: usuario._id,
                } as IOrdemVenda;

                await this.executarVenda(novaOrdem);

                return this.ordemVendaDao.salvarOrdemVenda(novaOrdem);
            });
    }

    private async executarVenda(ordemVenda: IOrdemVenda): Promise<void> {
        const transacaoAcao: TransacaoAcao = {
            ticker: ordemVenda.ticker,
            valorUnitario: ordemVenda.precoExecucao,
            quantidade: ordemVenda.quantidade,
            usuario: ordemVenda.usuario
        }

        await this.carteiraService.venderAcoes(transacaoAcao);
    }
}