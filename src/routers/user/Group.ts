import {BaseRoute} from '../BaseRoute';
import {Request, Response} from 'express';
import {Group as GroupModel} from '../../models/group';

export class Group extends BaseRoute {

    public createAction(): void {
        this.router.get('/create', (req: Request, res: Response) => {
            const group = {
                ownerId: req.body.user._id,
                name: 'Coglite Test',
                description: 'test group',
                members: ['592d63b319d6c078c368cce7', '59357fb019d6c078c368efb4', '5937e04e19d6c078c368f0fa', '5937fd6419d6c078c368f0fb'],
            };
            GroupModel.create(group,(err, group) => {
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

