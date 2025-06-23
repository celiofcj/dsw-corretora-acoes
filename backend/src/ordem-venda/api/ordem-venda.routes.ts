import {NextFunction, Request, Response, Router} from "express";
import {autenticarToken} from "../../security/auth.middleware";
import {OrdemVendaService} from "../service/ordem-venda.service";
import {IOrdemVenda, IOrdemVendaExecucao} from "../interface/ordem-venda";
import {ErrorMessage} from "../../error/ErrorMessage";
import {errorHandler} from "../../error/error.middleware";

const router = Router();

router.use(autenticarToken);

const ordemVendaService = new OrdemVendaService();

router.get('/', (req: Request, res: Response<Array<IOrdemVenda>>, next: NextFunction) => {
    ordemVendaService.obtemOrdensVenda(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch(error => next(error))
});

router.post('/', (req: Request<{}, {}, IOrdemVenda>, res: Response<IOrdemVenda | ErrorMessage | null>, next: NextFunction) => {
        ordemVendaService.salvarOrdemVenda(req.body, req.user!!)
            .then(salvo => res.status(201).json(salvo))
             .catch((error) => {
                 next(error)
             });
});

router.post("/:id/executar", (req: Request<{ id: string }, {}, IOrdemVendaExecucao>, res: Response<IOrdemVenda | ErrorMessage>, next: NextFunction)  => {

    ordemVendaService.executarBaseadoEmCompra(req.params.id, req.body, req.user!!)
        .then(ordemExecutada => res.status(201).json(ordemExecutada))
        .catch((error) => {
            next(error)
        });
});

router.use(errorHandler)

export default router;
