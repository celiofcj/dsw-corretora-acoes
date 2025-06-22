import {NextFunction, Request, Response, Router} from "express";
import {autenticarToken} from "../../security/auth.middleware";
import {errorHandler} from "../../error/error.middleware";
import {IHoraNegociacao} from "../model/HoraNegociacao";
import {NegociacaoService} from "../service/NegociacaoService";

const router = Router()

router.use(autenticarToken)

const negociacaoService = new NegociacaoService()

router.put('/atualizarHoraNegociacao', (req: Request<{}, {}, IHoraNegociacao>, res: Response<IHoraNegociacao>, next: NextFunction)=> {
    negociacaoService.atualizarHoraNegociacao(req.body, req.user!!)
        .then(negociacao=> res.status(200).json(negociacao))
        .catch(error => next(error))
})

router.get('/horaNegociacao', (req: Request<{}, {}, {}>, res: Response<IHoraNegociacao>, next: NextFunction) => {
    negociacaoService.obterHoraAtualizacao(req.user!!)
        .then(horaNegociacao => res.status(200).json(horaNegociacao))
        .catch(error => next(error))
})

router.use(errorHandler)

export default router