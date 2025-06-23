import {CarteiraDao} from "../dao/carteira.dao";
import {ContaCorrenteService} from "../../conta-corrente/service/ContaCorrenteService";
import {TransacaoAcao} from "../carteira.interface";
import {ICarteira} from "../model/Carteira";
import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {IMovimentacao, TipoMovimentacaoInfo} from "../../conta-corrente/model/Movimentacao";
import {TransacaoError} from "../../error/erros";

export class CarteiraService {
    private carteiraDao = new CarteiraDao() ;
    private contaCorrenteService = new ContaCorrenteService()
    private usuarioLogadoService = new UsuarioLogadoService()

    async obtemCarteiras(userData: UserData): Promise<Array<ICarteira>> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.carteiraDao.obterTodas(usuario.id);
            })
    }

    async comprarAcoes(transacao: TransacaoAcao): Promise<void> {
        const valorTransacao = transacao.valorUnitario * transacao.quantidade

        const movimentacao: IMovimentacao = {
            valor: valorTransacao,
            tipo: TipoMovimentacaoInfo.COMPRA_ACOES.id,
            descricao: `COMPRA DE ${transacao.quantidade} AÇÕES DE ${transacao.ticker} A R$${transacao.valorUnitario}`,
            dataHora: transacao.dataHora,
            usuario: transacao.usuario
        } as IMovimentacao

        await this.contaCorrenteService.registrarMovimentacao(movimentacao);

        await this.carteiraDao.obterDoTicker(transacao.ticker, transacao.usuario)
            .then(item => {
                if(item) {
                    item.precoCompra = this.calcularPrecoMedioCompra(item, transacao)
                    item.quantidade = item.quantidade + transacao.quantidade

                    return this.carteiraDao.salvar(item)
                }

                return this.carteiraDao.registrarTransacao(transacao)
            })
    }

    async venderAcoes(transacao: TransacaoAcao): Promise<void> {
        const valorTransacao = transacao.valorUnitario * transacao.quantidade

        const carteira = await this.carteiraDao.obterDoTicker(transacao.ticker, transacao.usuario)
            .then(item => {
                if(!item) {
                    throw new TransacaoError(`Não foi possível concluir a ordem de compra. Não existe as ações do ticker: ${transacao.ticker} na carteira.`)
                }

                if(item.quantidade < transacao.quantidade) {
                    throw new TransacaoError(`Não foi possível concluir a ordem de compra. Não existe as ações suficientes do ticker: ${transacao.ticker} na carteira.`)
                }

                return item
            })

        await this.contaCorrenteService.registrarMovimentacao({
            valor: valorTransacao,
            descricao: `VENDA DE ${transacao.quantidade} AÇÕES DE ${transacao.ticker} NO VALOR UNITÁRIO DE ${transacao.valorUnitario}`,
            tipo: TipoMovimentacaoInfo.VENDA_ACOES.id,
            dataHora: transacao.dataHora,
            usuario: transacao.usuario
        } as IMovimentacao)

        carteira.precoVenda = this.calcularPrecoMedioVenda(carteira, transacao)
        carteira.quantidadeVendida = (carteira.quantidadeVendida ?? 0) + transacao.quantidade
        carteira.quantidade = carteira.quantidade - transacao.quantidade

        await this.carteiraDao.salvar(carteira)
    }

    private calcularPrecoMedioCompra(carteira: ICarteira, transacao: TransacaoAcao): number {
        if(carteira.quantidade === 0) {
            return transacao.valorUnitario
        }

        const quantidadeTotal = carteira.quantidade + transacao.quantidade
        return ((carteira.quantidade * carteira.precoCompra) + (transacao.quantidade * transacao.valorUnitario)) / quantidadeTotal
    }

    private calcularPrecoMedioVenda(carteira: ICarteira, transacao: TransacaoAcao): number {
        if(carteira.quantidadeVendida == null || carteira.quantidadeVendida === 0) {
            return transacao.valorUnitario
        }

        if(!carteira.precoVenda) {
            throw new Error('Existem ações vendidas por preço null')
        }

        const quantidadeTotal = carteira.quantidadeVendida + transacao.quantidade
        return ((carteira.quantidadeVendida * carteira.precoVenda!!) + (transacao.quantidade * transacao.valorUnitario)) / quantidadeTotal
    }
}