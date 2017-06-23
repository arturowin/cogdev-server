import {BaseRoute} from '../BaseRoute';
import {Request, Response} from 'express';
import {Group as GroupModel} from '../../models/group';

export class Profile extends BaseRoute {

    public infoAction(): void {
        this.router.get('/info', (req: Request, res: Response) => {
            GroupModel.find({members: {$elemMatch: {$eq:req.body.user.uid} } }, (err, groups) => {
                res.json( {user: req.body.user, groups: groups} );
            });
        });
    }
}

