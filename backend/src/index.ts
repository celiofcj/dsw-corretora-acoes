import express, { Request, Response } from 'express';
import acaoInteresseRouter from "./acao-interesse/api/acao-interess.routes";
import acessoRouter from "./acesso/api/acesso.routes"
import {start} from "./config/startup";
import ordemCompraRouter from "./ordem-compra/api/ordem-compra.routes";
import ordemVendaRouter from "./ordem-venda/api/ordem-venda.routes";
import carteiraRouter from "./carteira/api/carteira.routes"
import horaNegociacaoRouter from "./hora-negociacao/api/hora-negociacao.routes";
import movimentacaoRouter from "./conta-corrente/api/MovimentacaoRoutes";

const app = express();
const PORT = 3000;

app.use(express.json())

start().then(()=> console.log('Servidor iniciado'))

app.get('/', (req: Request, res: Response) => {
    res.send('Tudo certo por aqui!');
});

app.use('/acesso', acessoRouter)

app.use('/acaoInteresse', acaoInteresseRouter)

app.use('/ordemCompra', ordemCompraRouter)

app.use('/ordemVenda', ordemVendaRouter)

app.use('/carteira', carteiraRouter)

app.use('/negociacao', horaNegociacaoRouter)

app.use('/movimentacao', movimentacaoRouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});