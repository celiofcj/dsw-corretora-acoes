import {NextFunction, Request, Response, Router} from "express";
import {autenticarToken} from "../../security/auth.middleware";
import {ContaCorrenteService} from "../service/ContaCorrenteService";
import {IMovimentacao} from "../model/Movimentacao";

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