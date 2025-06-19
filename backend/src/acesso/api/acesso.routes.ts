import {Request, Response, Router} from "express";
import {AcessoService} from "../service/AcessoService";
import {ErroValidacao, ErroValidacaoMessage} from "../../exception/erros";
import {DadosAcesso, Token} from "../interface/acesso.interface";

const router = Router();

const acessoService = new AcessoService();

router.post('/', (req: Request<{}, {}, DadosAcesso>, res) => {
    acessoService.criarConta(req.body)
        .then(() => res.status(201).send())
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

router.post('/login', (req: Request<{}, {}, DadosAcesso>, res: Response<Token | ErroValidacaoMessage>)=> {
    acessoService.login(req.body)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            if(erro instanceof ErroValidacao) {
                res.status(400).json({erro: erro.message})
            }
        })
})

export default router