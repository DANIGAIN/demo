import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";


export const errorHandler = (error:Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }
    let url = req.url;;
    let message = `${req.method} :${url} \n` +
        `Error : ${error.message} \n` +
        `Stack : ${error.stack}`;
    logger(message, 'error');
    return res.status(500).send({
        error: true,
        msg: "Internal server error"
    });
}
