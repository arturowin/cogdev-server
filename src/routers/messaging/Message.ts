import {BaseRoute} from '../BaseRoute';
import {Request, Response} from 'express';
import {Conversation as ConversationModel} from '../../models/conversation';
import {Messages as MessagesModel} from '../../models/messages';
import {Group as GroupModel} from '../../models/group';

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
            ConversationModel.find({$and: [{type: 'direct'},{$or: [{recipient: req.body.user._id},
                {fromUserId: req.body.user._id}]}]},
                '_id fromUserId recipient',
                {sort: {updatedAt: -1}})
                .populate('recipient fromUserId', '_id photoURL displayName')
                .exec((err: Error, conversations: any) => {
                    if(err){
                        res.status(400);
                        res.json({success: false, message: 'something went wrong'});
                    } else {
                        let interlocutorUsers: Array<{userId: string, photoURL: string | null, displayName: string, conversationId: string}> = [];
                        conversations.map((conversation) => {
                            const conversationId = conversation._id.toString();
                            const fromUserId = conversation.fromUserId._id.toString();
                            const recipient = conversation.recipient._id.toString();

                            if (fromUserId !== req.body.user._id) {
                                interlocutorUsers.push({
                                    userId: fromUserId,
                                    photoURL: conversation.fromUserId.photoURL.toString(),
                                    displayName: conversation.fromUserId.displayName.toString(),
                                    conversationId: conversationId
                                });
                            } else {
                                interlocutorUsers.push({
                                    userId: recipient,
                                    photoURL: conversation.recipient.photoURL.toString(),
                                    displayName: conversation.recipient.displayName.toString(),
                                    conversationId: conversationId
                                });
                            }
                        });
                        res.json({success: true, interlocutors: interlocutorUsers });
                    }
                });
        });
    }

    public getGroupConversationsAction(): void {
        this.router.get('/get-group-conversations', (req: Request, res: Response) => {
            GroupModel.find({members: {$elemMatch: {$eq: req.body.user._id} } }, {sort: {name: 1}}, (err: Error, groups: any) => {
                if (err) {
                    res.status(400);
                    res.json({success: false, message: 'something went wrong'});
                } else {
                    res.json({success: true, groups: groups});
                }
            });
        });
    }


    public getConversationMessagesAction(): void {
        this.router.get('/get-messages',(req: Request, res: Response) => {
            const limit = 30;
            console.log('skip',req.query.offset );
            MessagesModel.find({conversationId: req.query.id},
                '_id senderId conversationId messageBody updatedAt'
            )
            .sort({updatedAt: -1})
            .skip(parseInt(req.query.offset))
            .limit(limit)
            .populate('senderId','_id photoURL displayName')
            .exec((err: Error, messages: any) => {
                if (err) {
                    res.status(400);
                    res.json({success: false, message: 'something went wrong'});
                } else {
                    let messagesResponse: Array<{_id: string; senderId: string; conversationId: string;
                                                message: string;  updatedAt: Date; displayName: string,
                                                photoURL: string}> = [];
                    messages.map((message)=>{
                        messagesResponse.push({
                            _id: message._id.toString(),
                            senderId: message.senderId._id.toString(),
                            conversationId: message.conversationId.toString(),
                            message: message.messageBody,
                            updatedAt: message.updatedAt,
                            displayName: message.senderId.displayName,
                            photoURL: message.senderId.photoURL
                        });
                    });
                    res.json({success: true, message: messagesResponse});
                }
            });
        });
    }

}

