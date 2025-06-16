import {Request, Response} from "express";
import jwt from "jsonwebtoken"

export const verifyToken = function(req: Request, res:Response) {
    if (!req.headers) {
        return null;
    }

    if (!req.headers.authorization) {
        return null;
    }

    var authorization = req.headers.authorization.split(' ');

    if (authorization.length != 2) {
        return null;
    }

    try {
        return jwt.verify(authorization[1], 'aiusa7s8sdjm,d0-klaj');
    }
    catch (e) {
        return null;
    }
}

