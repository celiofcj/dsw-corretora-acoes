import {Request, Response, Router} from "express";
import {AcaoInteresseService} from "../service/acao-interesse.service";
import {IAcaoInteresse} from "../interface/acao-interesse";

const router = Router()

const acaoInteresseService = new AcaoInteresseService()

router.post('/', (req: Request<{}, {}, IAcaoInteresse>, res: Response<IAcaoInteresse>) => {
    acaoInteresseService.salvarAcaoInteresse(req.body)
        .then(salvo => res.status(201).json(salvo))

})

router.get('/', (req:Request<{}, {}, void>, res: Response<Array<IAcaoInteresse>>) => {
    acaoInteresseService.obtemAcoesInteresse()
        .then(resultado=> res.status(200).json(resultado))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    acaoInteresseService.removerAcaoInteresse(id)
        .then(() => res.status(204).json({}))
})

router.post('/:id/subir', (req, res: Response<IAcaoInteresse | null>) => {
    const id = req.params.id;
    acaoInteresseService.subirAcaoInteresse(id)
        .then((resultado) => res.status(200).json(resultado))
        .catch((error) => {
            console.log('Ocorreu um erro', error)
            res.status(400).json(null)
        });
})

router.post('/:id/descer', (req, res: Response<IAcaoInteresse | null>) => {
    const id = req.params.id;
    acaoInteresseService.descerAcaoInteresse(id)
        .then((resultado) => res.status(200).json(resultado))
        .catch((error) => {
            console.log('Ocorreu um erro', error)
            res.status(400).json(null)
        });
})

export default router