import {autenticarToken} from "../../security/auth.middleware";
import {Router, Request, Response, NextFunction} from 'express';
import {CarteiraService} from "../service/CarteiraService";
import {ICarteira} from "../model/Carteira";
import {errorHandler} from "../../error/error.middleware";

const router = Router();

router.use(autenticarToken)

const carteiraService = new CarteiraService();

router.get('/', (req: Request, res: Response<Array<ICarteira> | { erro: string }>, next: NextFunction) => {
    carteiraService.obtemCarteiras(req.user!!)
        .then(resultado => res.status(200).json(resultado))
        .catch(e => next(e))
});

router.use(errorHandler)

export default router;
