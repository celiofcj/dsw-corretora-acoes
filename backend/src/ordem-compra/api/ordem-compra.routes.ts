import {NextFunction, Request, Response, Router} from "express";
import {OrdemCompraService} from "../service/OrdemCompraService";
import {IOrdemCompra} from "../model/OrdemCompra";
import {autenticarToken} from "../../security/auth.middleware";
import {errorHandler} from "../../error/error.middleware";
import {PedidoExecucaoOrdemCompra, PedidoOrdemCompra} from "../interface/ordem-compra.interface";

const router  = Router();

router.use(autenticarToken)

const ordemCompraService = new OrdemCompraService();

router.get('/', (req : Request<{}, {}, void>, res: Response<Array<IOrdemCompra>>, next: NextFunction) => {
    ordemCompraService.obtemOrdensCompra(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.post('/', (req: Request<{}, {}, PedidoOrdemCompra>, res: Response<IOrdemCompra>, next: NextFunction) => {
        ordemCompraService.criarOrdemCompra(req.body, req.user!!)
            .then(salvo => res.status(201).json(salvo))
            .catch((erro) => {
                next(erro)
            })
})

router.post('/:id/executar', (req: Request<{id: string}, {}, PedidoExecucaoOrdemCompra>, res: Response<IOrdemCompra>, next: NextFunction) => {
    ordemCompraService.executarOrdemCompra(req.params.id, req.body, req.user!!)
        .then(salvo => res.status(201).json(salvo))
        .catch((erro) => {
            next(erro)
        })
})

router.use(errorHandler)

export default router