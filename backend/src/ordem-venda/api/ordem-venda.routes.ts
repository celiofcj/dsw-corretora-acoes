import {NextFunction, Request, Response, Router} from "express";
import {validarOrdemVenda} from "../validator/ordem-venda.validator";
import {autenticarToken} from "../../security/auth.middleware";
import {OrdemVendaService} from "../service/ordem-venda.service";
import {IOrdemVenda} from "../interface/ordem-venda";
import {ErrorMessage} from "../../error/ErrorMessage";
import {errorHandler} from "../../error/error.middleware";

const router = Router();

router.use(autenticarToken);

const ordemVendaService = new OrdemVendaService();

router.get('/', (req: Request, res: Response<Array<IOrdemVenda>>, next: NextFunction) => {
    ordemVendaService.obtemOrdensVenda()
        .then(resultado => res.status(200).json(resultado))
        .catch(error => next(error))
});

router.post('/', (req: Request<{}, {}, IOrdemVenda>, res: Response<IOrdemVenda | ErrorMessage | null>, next: NextFunction) => {
    // try {
        validarOrdemVenda(req.body);
        ordemVendaService.salvarOrdemVenda(req.body)
            .then(salvo => res.status(201).json(salvo))
            .catch(error => next(error))
    //         .catch((error) => {
    //             console.error('Erro ao salvar ordem de venda:', error);
    //             res.status(500).json({ errors: ['Erro ao salvar ordem.'] });
    //         });
    // } catch (e) {
    //     if (e instanceof ErroValidacao)
    //         res.status(400).json({ errors: [e.message] });
    // }
});

router.post("/:id/executar", (req: Request<{ id: string }, {}, { PrecoExecucao: number }>, res: Response<IOrdemVenda | ErrorMessage>, next: NextFunction)  => {
    const idOrdemCompra = req.params.id;
    const { PrecoExecucao } = req.body;

    if (PrecoExecucao == null || PrecoExecucao <= 0) {
        res.status(400).json({
            errors: ["O corpo da requisição deve conter um PrecoExecucao maior que zero."],
        });
    }

    ordemVendaService.executarBaseadoEmCompra(idOrdemCompra, { PrecoExecucao } as any)
        .then(ordemExecutada => res.status(201).json(ordemExecutada))
        .catch(error => {
            next(error)
        })
        // .catch(err => {
        //     console.error("Erro ao executar ordem de venda:", err);
        //     res.status(500).json({ errors: err.message });
        // });
});

router.use(errorHandler)

export default router;
