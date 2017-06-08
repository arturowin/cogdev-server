import * as jwt from 'jsonwebtoken';
import {Request, Response} from "express";
import {default as UserModel, UserSchema} from '../../models/user';
import {GoogleService} from '../../services/google.service';
import {BaseRoute} from "../BaseRoute";

export class Auth extends BaseRoute{


    public initRoutes(): void {
        this.authRoute();
    }

    public authRoute(): void {
        this.router.post('/', (req: Request, res: Response) => {
            new GoogleService(req.body.accessToken, req.body.refreshToken)
                .getGUser((err, gUser) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'Authentication failed.  User not found.'
                        });
                    } else {
                        UserSchema.createOrUpdate(req.body, (err, success) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'unable to create/update user'
                                });
                            } else {
                                UserModel.findOne({uid: gUser.id}, (err, user) => {
                                    const token = jwt.sign(user,
                                        process.env.APPLICATION_SECRET, {
                                            expiresIn: 604800 // 1 week
                                        });
                                    res.json({
                                        success: true,
                                        token: token
                                    });
                                });
                            }
                        });
                    }
                });
        });
    }
}

