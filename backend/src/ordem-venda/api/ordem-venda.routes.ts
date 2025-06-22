import {NextFunction, Request, Response, Router} from "express";
import {validarOrdemVenda} from "../validator/ordem-venda.validator";
import {autenticarToken} from "../../security/auth.middleware";
import {OrdemVendaService} from "../service/ordem-venda.service";
import {IOrdemVenda, IOrdemVendaExecucao} from "../interface/ordem-venda";
import {ErrorMessage} from "../../error/ErrorMessage";
import {errorHandler} from "../../error/error.middleware";
import {ErroValidacao} from "../../error/erros";

const router = Router();

router.use(autenticarToken);

const ordemVendaService = new OrdemVendaService();

router.get('/', (req: Request, res: Response<Array<IOrdemVenda>>, next: NextFunction) => {
    ordemVendaService.obtemOrdensVenda(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch(error => next(error))
});

router.post('/', (req: Request<{}, {}, IOrdemVenda>, res: Response<IOrdemVenda | ErrorMessage | null>, next: NextFunction) => {
     try {
        validarOrdemVenda(req.body);
        ordemVendaService.salvarOrdemVenda(req.body, req.user!!)
            .then(salvo => res.status(201).json(salvo))
             .catch((error) => {
                 console.error('Erro ao salvar ordem de venda:', error);
                 res.status(500).json({ errors: ['Erro ao salvar ordem.'] });
             });
     } catch (e) {
         if (e instanceof ErroValidacao)
             res.status(400).json({ errors: [e.message] });
     }
});

router.post("/:id/executar", (req: Request<{ id: string }, {}, IOrdemVendaExecucao>, res: Response<IOrdemVenda | ErrorMessage>, next: NextFunction)  => {
    const idOrdemCompra = req.params.id;
    const { precoExecucao, quantidade} = req.body;

    if (precoExecucao == null || precoExecucao <= 0) {
        res.status(400).json({
            errors: ["O corpo da requisição deve conter um precoExecucao maior que zero."],
        });
    }
    if (quantidade != null && quantidade <= 0) {
        res.status(400).json({
            errors: ["O corpo da requisição deve conter uma quantidade maior que zero."],
        });
    }

    ordemVendaService.executarBaseadoEmCompra(idOrdemCompra, { precoExecucao, quantidade}, req.user!!)
        .then(ordemExecutada => res.status(201).json(ordemExecutada))
        .catch(err => {
             console.error("Erro ao executar ordem de venda:", err);
             res.status(500).json({ errors: err.message });
         });
});

router.use(errorHandler)

export default router;
