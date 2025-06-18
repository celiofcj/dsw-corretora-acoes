import {NextFunction, Request, Response} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'

const JWT_SECRET = 'aiusa7s8sdjm,d0-klaj'

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const autenticarToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers || !req.headers.authorization) {
        res.status(401).json({ error: 'Token de autenticação não fornecido.' })
        return
    }

    const authHeader = req.headers.authorization
    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: 'Formato do token inválido. Use "Bearer <token>".' })
        return
    }

    const token = parts[1]

    try {
        req.user = jwt.verify(token, JWT_SECRET) as JwtPayload
        next()
    } catch (error) {
        console.error('Erro de verificação do token:', error)
        res.status(401).json({ error: 'Token de autenticação inválido ou expirado.' })
        return
    }
}