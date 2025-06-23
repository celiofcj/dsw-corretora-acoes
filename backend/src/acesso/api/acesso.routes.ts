import {NextFunction, Request, Response, Router} from "express";
import {AcessoService} from "../service/AcessoService";
import {DadosAcesso, TokenNovaSenha, Token, TrocaSenha, RecuperarSenha} from "../interface/acesso.interface";
import {autenticarToken} from "../../security/auth.middleware";
import {errorHandler} from "../../error/error.middleware";

const router = Router();

const acessoService = new AcessoService();

router.post('/', (req: Request<{},{}, DadosAcesso>, res: Response, next: NextFunction) => {
    acessoService.criarConta(req.body)
        .then(() => res.status(201).send())
        .catch((erro) => {
            next(erro)
        })
})

router.post('/login', (req: Request<{}, {}, DadosAcesso>, res: Response<Token>, next: NextFunction)=> {
    acessoService.login(req.body)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            next(erro)
        })
})

router.post('/trocarSenha', autenticarToken, (req: Request<{},{}, TrocaSenha>, res: Response, next: NextFunction) => {
    acessoService.trocarSenha(req.body, req.user!!)
        .then(() => res.status(204).send())
        .catch((erro) => {
            next(erro)
        })
})

router.post('/tokenNovaSenha', (req: Request<{}, {}, TokenNovaSenha>, res, next: NextFunction) => {
    acessoService.tokenNovaSenha(req.body)
        .then(()=> res.status(204).send())
        .catch((erro) => {
            next(erro)
        })
})

router.post('/recuperarSenha', (req: Request<{}, {}, RecuperarSenha>, res: Response, next: NextFunction)=> {
    acessoService.recuperarSenha(req.body)
        .then(() => res.status(204).send())
        .catch(error => next(error))
})

router.use(errorHandler)

export default router