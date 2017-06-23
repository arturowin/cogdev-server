import {BaseRoute} from '../BaseRoute';
import {Request, Response} from 'express';
import {Conversation as ConversationModel} from '../../models/conversation';
import {User as UserModel} from '../../models/user';
import {Messages as MessagesModel} from '../../models/messages';

export class Message extends BaseRoute {


    public newDirectConversationAction(): void {
        this.router.post('/new-direct-conversation', (req: Request, res: Response) => {
            if (true) { //@TODO
                const newConversation = {
                    type: 'direct',
                    fromUserId: req.body.user._id,
                    recipient: '5937e04e19d6c078c368f0fa'//req.body.interlocutorId,
                };
                ConversationModel.findOneOrCreate(newConversation, (err, conversation) => {
                    if (err) {
                        console.log(err);
                        res.status(400);
                        res.json({success: false, message: 'unable to create new conversation'});
                    } else {
                        res.json({success: true, conversation: conversation});
                    }
                });
            }
        });
    }

    public getRecentInterlocutorsAction(): void {
        this.router.get('/get-recent-interlocutors', (req: Request, res: Response) => {
            ConversationModel.find({$or: [{recipient: req.body.user._id},{fromUserId: req.body.user._id}]},
                'fromUserId recipient',
                {sort: {updatedAt: -1}},
                (err, conversations) => {
                    if (err) {
                        res.status(400);
                        res.json({success: false, message: 'unable to get conversations'});
                    } else {
                        let interlocutors: Array<string> = [];
                        conversations.map((user) => {

                            const fromUserId = user.fromUserId.toString();
                            const recipient = user.recipient.toString();

                            if (fromUserId !== req.body.user._id) {
                                interlocutors.push(fromUserId)
                            } else {
                                interlocutors.push(recipient)
                            }
                        });
                        UserModel.find({ _id: { "$in" : interlocutors} },'_id uid photoURL displayName',(err, users) => {
                            console.log(users);
                            res.json({success: true, interlocutors: users });
                        });

                    }
                });
        });
    }


    public getConversationMessagesAction(): void {
        this.router.get('/get-messages/:id',(req: Request, res: Response) => {
            MessagesModel.find({conversationId: req.params.id},(err, messages) => {
                if (err) {
                    res.status(400);
                    res.json({success: false, message: 'something went wrong'});
                } else {
                    let senderIds: Array<string> = [];
                    messages.map((message) => {
                        const senderId: string = message.senderId.toString();

                        if(senderId == req.body.user._id) {
                            message.user = {
                                _id: req.body.user._id,
                                photoURL: req.body.user.photoURL,
                                displayName: req.body.user.displayName,
                            }
                        } else {
                            senderIds.push(senderId);
                        }
                    });
                    console.log(messages);
                    UserModel.find({ _id: { "$in" : senderIds} },'_id photoURL displayName',(err, users) => {
                        console.log(users);
                        res.json({success: true, interlocutors: users });
                    });

                }
            });
        });
    }

}

