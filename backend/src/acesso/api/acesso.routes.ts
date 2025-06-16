import {Router, Request, Response} from "express";
import {AcessoService} from "../service/acesso.service";
import {Acesso, Token} from "../interface/acesso.interface";
import {ErroValidacao, ErroValidacaoMessage} from "../../exception/erros";

const router = Router();

const acessoService = new AcessoService();

router.post('/', (req: Request<{}, {}, Acesso>, res) => {
    acessoService.criarConta(req.body)
        .then(() => res.status(201).json({}))
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

router.post('/login', (req: Request<{}, {}, Acesso>, res: Response<Token | ErroValidacaoMessage>)=> {
    acessoService.login(req.body)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

export default router