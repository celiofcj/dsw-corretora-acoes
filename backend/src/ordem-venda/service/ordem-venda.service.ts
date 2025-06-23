import {IOrdemVenda, IOrdemVendaExecucao} from "../interface/ordem-venda";
import {OrdemVendaDao} from "../dao/ordem-venda.dao";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {UserData} from "../../security/UserData";
import {NotFoundError, TransacaoError} from "../../error/erros";
import {CarteiraService} from "../../carteira/service/CarteiraService";
import {TransacaoAcao} from "../../carteira/carteira.interface";
import {validarOrdemVenda} from "../validator/ordem-venda.validator";


export class OrdemVendaService {
    private ordemVendaDao = new OrdemVendaDao();
    private usuarioLogadoService = new UsuarioLogadoService();
    private carteiraService = new CarteiraService();

    async salvarOrdemVenda(ordemVenda: IOrdemVenda, userData: UserData): Promise<IOrdemVenda> {
        validarOrdemVenda(ordemVenda)
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

    async executarBaseadoEmCompra(idOrdemVenda: string, dadosVenda: IOrdemVendaExecucao, userData: UserData): Promise<IOrdemVenda> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(async usuario => {
                const ordemVenda = await this.ordemVendaDao.obterUma(idOrdemVenda, usuario._id)
                if (!ordemVenda) {
                    throw new NotFoundError(`Ordem de compra com ID ${idOrdemVenda} não encontrada.`);
                }

                if(ordemVenda.executada) {
                    throw new TransacaoError(`A negociação com id ${idOrdemVenda} já foi executada`)
                }

                ordemVenda.executada = true
                ordemVenda.precoExecucao = dadosVenda.precoExecucao
                ordemVenda.dataHoraExecucao = dadosVenda.datahora

                await this.executarVenda(ordemVenda);

                return this.ordemVendaDao.salvarOrdemVenda(ordemVenda);
            });
    }

    private async executarVenda(ordemVenda: IOrdemVenda): Promise<void> {
        const transacaoAcao: TransacaoAcao = {
            ticker: ordemVenda.ticker,
            valorUnitario: ordemVenda.precoExecucao,
            quantidade: ordemVenda.quantidade,
            usuario: ordemVenda.usuario,
            dataHora: ordemVenda.dataHora
        }

        await this.carteiraService.venderAcoes(transacaoAcao);
    }
}