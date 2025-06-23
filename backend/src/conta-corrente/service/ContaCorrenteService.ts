import {UserData} from "../../security/UserData";
import {UsuarioLogadoService} from "../../acesso/service/UsuarioLogadoService";
import {IMovimentacao} from "../model/Movimentacao";
import {ContaCorrenteDao} from "../dao/ContaCorrenteDao";


interface Temp {
    valor: number,
    descricao: string,
    tipo: string
}

export class ContaCorrenteService {
    private contaCorrenteDao = new ContaCorrenteDao();
    private usuarioLogadoService = new UsuarioLogadoService()

    async registrarMovimentacao(movimentacao: IMovimentacao): Promise<IMovimentacao> {
        const tipo = movimentacao.tipo.toLowerCase().trim();
        const valor = movimentacao.valor;
        const usuario = movimentacao.usuario;

        const conta = await this.contaCorrenteDao.obterConta(usuario);
        if (!conta) {
            throw new Error("Conta corrente não encontrada.");
        }

        if (["compra de ações", "retirada"].includes(tipo)) {
            if (conta.saldo < valor) {
                throw new Error("Saldo insuficiente.");
            }
            conta.saldo -= valor;
        } else if (["depósito", "venda de ações"].includes(tipo)) {
            conta.saldo += valor;
        } else {
            throw new Error("Tipo de movimentação inválido.");
        }

        await this.contaCorrenteDao.salvarConta(conta);

        movimentacao.dataHora = new Date();

        return this.contaCorrenteDao.salvarMovimentacao(movimentacao);
    }

    async obtemMovimentacoes(userData: UserData) : Promise<Array<IMovimentacao>> {
        return this.usuarioLogadoService.obterUsuarioLogado(userData)
            .then(usuario => {
                return this.contaCorrenteDao.obterTodasMovimentacoes(usuario._id);
            })
    }
}