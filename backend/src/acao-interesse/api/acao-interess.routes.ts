import {NextFunction, Request, Response, Router} from "express";
import {AcaoInteresseService} from "../service/AcaoInteresseService";
import {IAcaoInteresse} from "../model/AcaoInteresse";
import {autenticarToken} from "../../security/auth.middleware";
import {errorHandler} from "../../error/error.middleware";

const router = Router()

router.use(autenticarToken)

const acaoInteresseService = new AcaoInteresseService()

router.post('/', (req: Request<{}, {}, IAcaoInteresse>, res: Response<IAcaoInteresse>, next: NextFunction) => {
    acaoInteresseService.salvarAcaoInteresse(req.body, req.user!!)
        .then(salvo => res.status(201).json(salvo))
        .catch((erro) => {
            next(erro)
        })

})

router.get('/', (req:Request<{}, {}, void>, res: Response<Array<IAcaoInteresse>>, next: NextFunction) => {
    acaoInteresseService.obtemAcoesInteresse(req.user!!)
        .then(resultado=> res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.delete('/:id', (req, res, next: NextFunction) => {
    const id = req.params.id;
    acaoInteresseService.removerAcaoInteresse(id, req.user!!)
        .then(() => res.status(204).json({}))
        .catch((erro) => {
            next(erro)
        })
})

router.post('/:id/subir', (req, res: Response<IAcaoInteresse >, next: NextFunction) => {
    const id = req.params.id;
    acaoInteresseService.subirAcaoInteresse(id, req.user!!)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.post('/:id/descer', (req, res: Response<IAcaoInteresse>, next: NextFunction) => {
    const id = req.params.id;
    acaoInteresseService.descerAcaoInteresse(id, req.user!!)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.use(errorHandler)

export default router