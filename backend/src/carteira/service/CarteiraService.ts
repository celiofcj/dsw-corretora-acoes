import {CarteiraDao} from "../dao/carteira.dao";
import {ContaCorrenteService} from "../../conta-corrente/service/ContaCorrenteService";
import {TransacaoAcao} from "../carteira.interface";
import {ICarteira} from "../model/Carteira";
import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {IMovimentacao} from "../../conta-corrente/model/Movimentacao";

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
            tipo: "compra de ações",
            descricao: `COMPRA DE ${transacao.quantidade} AÇÕES DE ${transacao.ticker} A R$${transacao.valorUnitario}`,
            dataHora: new Date(),
            usuario: transacao.usuario
        };

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
        await this.contaCorrenteService.registrarMovimentacao({
            valor: valorTransacao,
            descricao: `VENDA DE ${transacao.quantidade} AÇÕES DE ${transacao.ticker} NO VALOR UNITÁRIO DE ${transacao.valorUnitario}`,
            tipo: 'VENDA DE AÇÕES'
        })

        await this.carteiraDao.obterDoTicker(transacao.ticker, transacao.usuario)
            .then(item => {
                if(item) {
                    item.precoVenda = (item.precoVenda ?? 0) + valorTransacao
                    item.quantidadeVendida = (item.quantidadeVendida ?? 0) + transacao.quantidade

                    return this.carteiraDao.salvar(item)
                }

                return this.carteiraDao.registrarTransacao(transacao)
            })
    }


    private calcularPrecoMedioCompra(carteira: ICarteira, transacao: TransacaoAcao, ): number {
        if(carteira.quantidade === 0) {
            return transacao.valorUnitario
        }

        const quantidadeTotal = carteira.quantidade + transacao.quantidade
        return ((carteira.quantidade * carteira.precoCompra) + (transacao.quantidade * transacao.valorUnitario)) / quantidadeTotal
    }
}