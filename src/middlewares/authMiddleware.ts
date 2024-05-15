import { NextFunction, Request, Response } from "express";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization
    if (auth) {
        next();
    } else {
        res.locals.status = 401;
        next(new Error('Unauthorized'));
    }
}