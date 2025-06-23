import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {IMovimentacao, TipoMovimentacaoInfo, TipoTransacaoId} from "../model/Movimentacao";
import {ContaCorrenteDao} from "../dao/ContaCorrenteDao";
import {ErroValidacao} from "../../error/erros";

export class ContaCorrenteService {
    private contaCorrenteDao = new ContaCorrenteDao();
    private usuarioLogadoService = new UsuarioLogadoService()

    async registrarMovimentacao(movimentacao: IMovimentacao): Promise<IMovimentacao> {
        const tipoId: TipoTransacaoId = movimentacao.tipo;
        const valor = movimentacao.valor;
        const usuario = movimentacao.usuario;

        const info = TipoMovimentacaoInfo[tipoId];

        if (!info) {
            throw new ErroValidacao([`Tipo de movimentação desconhecido: ${tipoId}`]);
        }

        const conta = await this.contaCorrenteDao.obterConta(usuario);
        if (!conta) {
            throw new ErroValidacao(['Conta corrente não encontrada.']);
        }

        switch (info.operacao) {
            case 'saída':
                if (conta.saldo < valor) {
                    throw new Error("Saldo insuficiente.");
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
}