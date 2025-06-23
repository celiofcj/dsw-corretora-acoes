import {NextFunction, Request, Response, Router} from "express";
import {autenticarToken} from "../../security/auth.middleware";
import {OrdemVendaService} from "../service/ordem-venda.service";
import {IOrdemVenda} from "../model/ordem-venda";
import {ErrorMessage} from "../../error/ErrorMessage";
import {errorHandler} from "../../error/error.middleware";
import {ErroValidacao} from "../../error/erros";
import {PedidoExecucaoOrdemVenda, PedidoOrdemVenda} from "../interface/ordem-venda.interface";

const router = Router();

router.use(autenticarToken);

const ordemVendaService = new OrdemVendaService();

router.get('/', (req: Request, res: Response<Array<IOrdemVenda>>, next: NextFunction) => {
    ordemVendaService.obtemOrdensVenda(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch(error => next(error))
});

router.post('/', (req: Request<{}, {}, PedidoOrdemVenda>, res: Response<IOrdemVenda | ErrorMessage | null>, next: NextFunction) => {
     try {
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

router.post("/:id/executar", (req: Request<{ id: string }, {}, PedidoExecucaoOrdemVenda>, res: Response<IOrdemVenda | ErrorMessage>, next: NextFunction)  => {

    ordemVendaService.executarOrdemVenda(req.params.id, req.body, req.user!!)
        .then(ordemExecutada => res.status(201).json(ordemExecutada))
        .catch(err => {
             console.error("Erro ao executar ordem de venda:", err);
             res.status(500).json({ errors: err.message });
         });
});

router.use(errorHandler)

export default router;
