import express, { Request, Response } from 'express';
import acaoInteresseRouter from "./acao-interesse/api/acao-interess.routes";
import acessoRouter from "./acesso/api/acesso.routes"
import {start} from "./config/startup";
import ordemCompraRouter from "./ordem-compra/api/ordem-compra.routes";

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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});