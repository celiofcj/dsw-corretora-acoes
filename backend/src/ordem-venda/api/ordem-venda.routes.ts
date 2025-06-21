import { Request, Response, Router } from "express";
import { ErroValidacao, ErroMessage } from "../../exception/erros";
import { validarOrdemVenda } from "../validator/ordem-venda.validator";
import { autenticarToken } from "../../security/auth.middleware";
import { OrdemVendaService } from "../service/ordem-venda.service";
import {IOrdemVenda, IOrdemVendaExecucao} from "../interface/ordem-venda";

const router = Router();

router.use(autenticarToken);

const ordemVendaService = new OrdemVendaService();

router.get('/', (req: Request, res: Response<Array<IOrdemVenda>>) => {
    ordemVendaService.obtemOrdensVenda()
        .then(resultado => res.status(200).json(resultado));
});

router.post('/', (req: Request<{}, {}, IOrdemVenda>, res: Response<IOrdemVenda | ErroMessage | null>) => {
    try {
        validarOrdemVenda(req.body);
        ordemVendaService.salvarOrdemVenda(req.body)
            .then(salvo => res.status(201).json(salvo))
            .catch((error) => {
                console.error('Erro ao salvar ordem de venda:', error);
                res.status(500).json({ erro: 'Erro ao salvar ordem.' });
            });
    } catch (e) {
        if (e instanceof ErroValidacao)
            res.status(400).json({ erro: e.message });
    }
});

router.post("/:id/executar", (req: Request<{ id: string }, {}, { PrecoExecucao: number }>, res: Response<IOrdemVenda | ErroMessage>) => {
    const idOrdemCompra = req.params.id;
    const { PrecoExecucao } = req.body;

    if (PrecoExecucao == null || PrecoExecucao <= 0) {
        return res.status(400).json({
            erro: "O corpo da requisição deve conter um PrecoExecucao maior que zero.",
        });
    }

    ordemVendaService.executarBaseadoEmCompra(idOrdemCompra, { PrecoExecucao } as any)
        .then(ordemExecutada => res.status(201).json(ordemExecutada))
        .catch(err => {
            console.error("Erro ao executar ordem de venda:", err);
            res.status(500).json({ erro: err.message });
        });
});

export default router;
