import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Olá, mundo com TypeScript!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});