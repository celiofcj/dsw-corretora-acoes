import {Request, Response, Router} from "express";
import {AcaoInteresseService} from "../service/acao-interesse.service";
import {IAcaoInteresse} from "../interface/acao-interesse";

const acaoInteresseRouter = Router()

const router = new AcaoInteresseService()

acaoInteresseRouter.post('/', (req: Request<{}, {}, IAcaoInteresse>, res: Response<IAcaoInteresse>) => {
    router.salvarAcaoInteresse(req.body)
        .then(salvo => res.status(201).json(salvo))

})

export default acaoInteresseRouter