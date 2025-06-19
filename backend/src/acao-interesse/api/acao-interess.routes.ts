import {Request, Response, Router} from "express";
import {AcaoInteresseService} from "../service/acao-interesse.service";
import {IAcaoInteresse} from "../interface/AcaoInteresse";
import {ErroMessage, NotFoundError} from "../../exception/erros";
import {autenticarToken} from "../../security/auth.middleware";

const router = Router()

router.use(autenticarToken)

const acaoInteresseService = new AcaoInteresseService()

router.post('/', (req: Request<{}, {}, IAcaoInteresse>, res: Response<IAcaoInteresse | ErroMessage>) => {
    acaoInteresseService.salvarAcaoInteresse(req.body, req.user!!)
        .then(salvo => res.status(201).json(salvo))

})

router.get('/', (req:Request<{}, {}, void>, res: Response<Array<IAcaoInteresse> | ErroMessage>) => {
    acaoInteresseService.obtemAcoesInteresse(req.user!!)
        .then(resultado=> res.status(200).json(resultado))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    acaoInteresseService.removerAcaoInteresse(id, req.user!!)
        .then(() => res.status(204).json({}))
})

router.post('/:id/subir', (req, res: Response<IAcaoInteresse | ErroMessage | null>) => {
    const id = req.params.id;
    acaoInteresseService.subirAcaoInteresse(id, req.user!!)
        .then((resultado) => res.status(200).json(resultado))
        .catch((error) => {
            if(error instanceof NotFoundError) {
                res.status(404).json({ erro: error.message });
                return
            }

            console.log('Ocorreu um erro', error)
            res.status(400).send()
        });
})

router.post('/:id/descer', (req, res: Response<IAcaoInteresse | ErroMessage | null>) => {
    const id = req.params.id;
    acaoInteresseService.descerAcaoInteresse(id, req.user!!)
        .then((resultado) => res.status(200).json(resultado))
        .catch((error) => {
            if(error instanceof NotFoundError) {
                res.status(404).json({ erro: error.message });
                return
            }

            console.log('Ocorreu um erro', error)
            res.status(400).send()
        });
})

export default router