import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {IMovimentacao, TipoMovimentacaoInfo, TipoTransacaoId} from "../model/Movimentacao";
import {ContaCorrenteDao} from "../dao/ContaCorrenteDao";
import {TransacaoError} from "../../error/erros";
import {Types} from "mongoose";
import {IContaCorrente} from "../model/ContaCorrente";

export class ContaCorrenteService {
    private contaCorrenteDao = new ContaCorrenteDao();
    private usuarioLogadoService = new UsuarioLogadoService()

    async obterContaCorrente(userData: UserData) : Promise<IContaCorrente> {
        const usuario = await this.usuarioLogadoService.obterUsuarioLogado(userData)
        return this.contaCorrenteDao.obterConta(usuario._id)
            .then((conta) => {
                if(!conta) {
                    return this.criarContaCorrente(usuario._id)
                }

                return conta
            })
    }

    async registrarMovimentacaoExterna(movimentacao: IMovimentacao, userData: UserData): Promise<IMovimentacao> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                movimentacao.usuario = usuario.id
                return this.registrarMovimentacao(movimentacao)
            })
    }

    async registrarMovimentacao(movimentacao: IMovimentacao): Promise<IMovimentacao> {
        const tipoId: TipoTransacaoId = movimentacao.tipo;
        const valor = movimentacao.valor;
        const usuario = movimentacao.usuario;

        const info = TipoMovimentacaoInfo[tipoId];

        if (!info) {
            throw new Error(`Tipo de movimentação desconhecido: ${tipoId}`);
        }

        const conta = await this.contaCorrenteDao.obterConta(usuario)
            .then(conta => {
                if (!conta) {
                    return this.criarContaCorrente(usuario)
                }

                return conta
            })

        switch (info.operacao) {
            case 'saída':
                if (conta.saldo < valor) {
                    throw new TransacaoError("Saldo insuficiente.");
                }
                conta.saldo -= valor;
                break;

            case 'entrada':
                conta.saldo += valor;
                break;
        }

        await this.contaCorrenteDao.salvarConta(conta);

        return this.contaCorrenteDao.salvarMovimentacao(movimentacao);
    }

    async obtemMovimentacoes(userData: UserData) : Promise<Array<IMovimentacao>> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.contaCorrenteDao.obterTodasMovimentacoes(usuario._id);
            })
    }

    private async criarContaCorrente(usuario: Types.ObjectId): Promise<IContaCorrente> {
        return this.contaCorrenteDao.salvarConta({
            usuario: usuario,
            saldo: 0
        })
    }
}