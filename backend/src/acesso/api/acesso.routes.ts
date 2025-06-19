import {Request, Response, Router} from "express";
import {AcessoService} from "../service/AcessoService";
import {AutenticacaoError, ErroMessage, ErroValidacao} from "../../exception/erros";
import {DadosAcesso, Token, TrocaSenha} from "../interface/acesso.interface";
import {autenticarToken} from "../../security/auth.middleware";

const router = Router();

const acessoService = new AcessoService();

router.post('/', (req: Request<{}, {}, DadosAcesso>, res: Response) => {
    acessoService.criarConta(req.body)
        .then(() => res.status(201).send())
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

router.post('/login', (req: Request<{}, {}, DadosAcesso>, res: Response<Token | ErroMessage>)=> {
    acessoService.login(req.body)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

router.post('/trocarSenha', autenticarToken, (req: Request<{},{}, TrocaSenha>, res: Response) => {
    acessoService.trocarSenha(req.body, req.user!!)
        .then(() => res.status(204).send())
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
            if(erro instanceof AutenticacaoError) {
                res.status(403).send()
            }
        })
})

export default router