import {Request, Response, Router} from "express";
import { OrdemVendaService } from "../service/ordem-venda.service";
import { IOrdemVenda } from "../interface/ordem-venda";

const router = Router()

const service = new OrdemVendaService()

router.post("/", (req: Request<{}, {}, IOrdemVenda>, res: Response<IOrdemVenda>) => {
    service.criar(req.body)
        .then(ordem => res.status(201).json(ordem))
        .catch(erro => {
            console.error(erro);
            res.status(400).json({ erro: "Erro ao criar ordem de venda" } as any);
        });
})

router.get("/", (req: Request, res: Response<Array<IOrdemVenda>>) => {
    service.listar()
        .then(ordens => res.status(200).json(ordens))
        .catch(erro => {
            console.error(erro);
            res.status(500).json([]);
        });
})

export default router;