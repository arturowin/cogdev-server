import * as jwt from 'jsonwebtoken';
import {NextFunction} from "express";

export const socketGuard = (socket: any, next: NextFunction) => {
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, process.env.APPLICATION_SECRET, (err, decoded) => {
            if(err) return next(new Error('Authentication error1'));
            socket.user = decoded._doc;
            next();
        });
    }
    next(new Error('Authentication error2'));
}