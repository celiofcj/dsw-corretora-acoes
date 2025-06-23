import {NextFunction, Request, Response, Router} from "express";
import {autenticarToken} from "../../security/auth.middleware";
import {ContaCorrenteService} from "../service/ContaCorrenteService";
import {IMovimentacao} from "../model/Movimentacao";
import {errorHandler} from "../../error/error.middleware";
import {IContaCorrente} from "../model/ContaCorrente";

const router  = Router();

router.use(autenticarToken)

const contaCorrenteService = new ContaCorrenteService();

router.get('/', (req : Request<{}, {}, void>, res: Response<Array<IMovimentacao>>, next: NextFunction) => {
    contaCorrenteService.obtemMovimentacoes(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.post('/', (req : Request<{}, {}, IMovimentacao>, res: Response<IMovimentacao>, next: NextFunction) => {
    contaCorrenteService.registrarMovimentacaoExterna(req.body, req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.get('/contaCorrente', (req: Request<{}, {}, {}>, res: Response<IContaCorrente>, next: NextFunction) => {
    contaCorrenteService.obterContaCorrente(req.user!!)
        .then(resultado=>res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.use(errorHandler)

export default router