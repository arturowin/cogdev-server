import {BaseRoute} from '../BaseRoute';
import {Request, Response} from 'express';
import {default as GroupModel} from '../../models/group';

export class Group extends BaseRoute {

    public initRoutes(): void {
        this.createRoute();
    }

    public createRoute(): void {
        this.router.post('/create', (req: Request, res: Response) => {
            GroupModel.create(req.body, (err, group) => {
                if (err) {
                    console.log(err);
                    res.json({success: false, msg:'unable to create'});
                } else {
                    res.json(group);
                }
            })
        });
    }

}

