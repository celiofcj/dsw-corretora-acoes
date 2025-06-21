import {NextFunction, Request, Response} from "express";
import {Error} from "mongoose";
import {ResponsibleError} from "./erros";
import {ErrorMessage} from "./ErrorMessage";

export function errorHandler(error: Error, req: Request, res: Response<ErrorMessage>, next: NextFunction) {
    console.log(error.stack)

    if(error instanceof ResponsibleError) {
        error.response(res)
        return
    }

    res.status(500).json({errors: ['Ocorreu um erro inesperado']})
}