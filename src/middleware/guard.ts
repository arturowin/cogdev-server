import * as jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

export const guard = (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === `/${process.env.API_VERSION}/${process.env.AUTH_PATH}`) {
        next();
    } else {
        const token = req.headers['authorization'];
        if (token) {
            jwt.verify(token, process.env.APPLICATION_SECRET, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.body.user = user;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};