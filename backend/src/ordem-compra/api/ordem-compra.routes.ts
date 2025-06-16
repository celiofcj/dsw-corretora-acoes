import {Request, Response, Router} from "express";
import {OrdemCompraService} from "../service/ordem-compra.service";
import {IOrdemCompra} from "../interface/ordem-compra";

const router  = Router();

const ordemCompraService = new OrdemCompraService();

router.get('/', (req : Request<{}, {}, void>, res: Response<Array<IOrdemCompra>>) => {
    ordemCompraService.obtemOrdensCompra()
        .then(resultado => res.status(200).json(resultado))
})

router.post('/', (req: Request<{}, {}, IOrdemCompra>, res: Response<IOrdemCompra>) => {
    ordemCompraService.salvarOrdemCompra(req.body)
        .then(salvo => res.status(201).json(salvo))
})

router.post('/:id/executar', (req: Request<{id: string}, {}, IOrdemCompra>, res: Response<IOrdemCompra>) => {
    ordemCompraService.executarOrdemCompra(req.params.id, req.body)
        .then(salvo => res.status(201).json(salvo))
})

export default router