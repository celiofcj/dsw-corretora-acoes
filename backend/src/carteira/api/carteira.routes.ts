import {autenticarToken} from "../../security/auth.middleware";
import { Router, Request, Response } from 'express';
import {CarteiraService} from "../service/carteira.service";
import {ICarteira} from "../interface/carteira";

const router = Router();
router.use(autenticarToken)

const carteiraService = new CarteiraService();

router.get('/', (req: Request, res: Response<Array<ICarteira> | { erro: string }>) => {
    carteiraService.obtemCarteiras()
        .then(resultado => res.status(200).json(resultado))
        .catch(e => {
            console.error('Erro ao obter carteiras:', e);
            res.status(500).json({ erro: 'Erro ao obter carteiras' });
        });
});

export default router;
