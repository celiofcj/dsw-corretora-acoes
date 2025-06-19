import {Request, Response, Router} from "express";
import {OrdemCompraService} from "../service/ordem-compra.service";
import {IOrdemCompra} from "../interface/ordem-compra";
import {ErroValidacao, ErroMessage} from "../../exception/erros";
import {validarOrdemCompra} from "../validator/ordem-compra.validator";
import {autenticarToken} from "../../security/auth.middleware";

const router  = Router();

router.use(autenticarToken)

const ordemCompraService = new OrdemCompraService();

router.get('/', (req : Request<{}, {}, void>, res: Response<Array<IOrdemCompra>>) => {
    ordemCompraService.obtemOrdensCompra()
        .then(resultado => res.status(200).json(resultado))
})

router.post('/', (req: Request<{}, {}, IOrdemCompra>, res: Response<IOrdemCompra | ErroMessage | null>) => {
    try {
        validarOrdemCompra(req.body);
        ordemCompraService.salvarOrdemCompra(req.body)
            .then(salvo => res.status(201).json(salvo))
            .catch((error) => {
                console.error('Erro ao salvar ordem:', error);
                res.status(500).json({ erro: 'Erro ao salvar ordem.' });
            });
    } catch (e) {
        if (e instanceof ErroValidacao)
            res.status(400).json({ erro: e.message });
    }
})

router.post('/:id/executar', (req: Request<{id: string}, {}, IOrdemCompra>, res: Response<IOrdemCompra>) => {
    ordemCompraService.executarOrdemCompra(req.params.id, req.body)
        .then(salvo => res.status(201).json(salvo))
})

export default router