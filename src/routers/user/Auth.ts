import * as jwt from 'jsonwebtoken';
import {Request, Response} from "express";
import { User } from "../../models/user";
import {GoogleService} from '../../services/google.service';
import {BaseRoute} from "../BaseRoute";

export class Auth extends BaseRoute {

    public authAction(): void {
        this.router.post('/', (req: Request, res: Response) => {
            new GoogleService()
                .getToken(req.body.auth_code, (err, tokens) => {
                    if (err) {
                        res.status(403);
                        res.json({
                            success: false,
                            message: 'Authentication failed.  User not found.'
                        });
                    } else {
                        let user = req.body;
                        user.accessToken = tokens.access_token;
                        if(typeof tokens.refresh_token !== 'undefined') {
                            user.refreshToken = tokens.refresh_token;
                        }
                        User.createOrUpdate(user, (err, success) => {
                            if (err) {
                                res.status(403);
                                res.json({
                                    success: false,
                                    message: 'unable to create/update user'
                                });
                            } else {
                                User.findOne({uid: user.uid}, (err, user) => {
                                    const token = jwt.sign(user,
                                        process.env.APPLICATION_SECRET, {
                                            expiresIn: 604800 // 1 week
                                        });
                                    res.json({
                                        success: true,
                                        token: token,
                                        _id: user._id.toString()
                                    });
                                });
                            }
                        });
                    }
                });
        });
    }
}

