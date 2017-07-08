import {Schema, Model, Document, model} from 'mongoose';
import {Notification} from './notification';

export interface IConversation extends Document {
    type: string;
    fromUserId: Schema.Types.ObjectId;
    recipient: Schema.Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

export interface IConversationModel {
    createOrUpdate(upsertData: any, callback: any): void
    findOneOrCreate(data: any, callback: Function): void
    getConversations(userId: string | Schema.Types.ObjectId, offset: number, limit: number): Promise<any>
    findConversationById(conversationId: string | Schema.Types.ObjectId, userId: string | Schema.Types.ObjectId)
}

const conversationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
    },
    updatedAt: {
        type: Date,
        "default": Date.now()
    },
    createdAt: {
        type: Date,
        "default": Date.now()
    }
});

conversationSchema.static('createOrUpdate', (upsertData: any, callback: any) => {
    Conversation.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
});

conversationSchema.static('findOneOrCreate', (data: any, callback: Function) => {
    Conversation.findOne(data, (err, conversation) => {
        return conversation
            ? callback(err, conversation)
            : Conversation.create(data, (err, conversation) => {
                return callback(err, conversation);
            });
    });
});


conversationSchema.static('getConversations', (userId: string | Schema.Types.ObjectId, offset: number, limit: number) => {
   return new Promise((resolve, reject) => {
        Conversation.find({$and: [{type: 'direct'},{$or: [{recipient: userId},
                {fromUserId: userId}]}]},
            '_id fromUserId recipient',
            {sort: {updatedAt: -1}, skip: offset, limit: limit})
            .populate('recipient fromUserId', '_id photoURL displayName status updatedAt')
            .exec((err: Error, conversations: any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const conversationIds: Array<string> = [];
                    conversations.map((conversation) => {
                        conversationIds.push(conversation._id);
                    });

                    const interlocutorUsers: Array<{userId: string, photoURL: string | null,
                        displayName: string, conversationId: string,
                        notifications: number, status: string, lastSeen: Date
                    }> = [];
                    const maxNotifyCount = 100;
                    Notification.find({ toUserId: userId, seen: false, conversationId: { $in: conversationIds }},
                        'conversationId',
                        {limit: maxNotifyCount},
                        (err, notifications)=> {
                            conversations.map((conversation) => {
                                const conversationId = conversation._id.toString();
                                const fromUserId = conversation.fromUserId._id.toString();
                                const recipient = conversation.recipient._id.toString();
                                let notifyCount: any = notifications.filter((notification : any) => {
                                    return notification.conversationId.toString() === conversationId;
                                });
                                notifyCount = notifyCount.length;
                                if (fromUserId !== userId) {
                                    interlocutorUsers.push({
                                        userId: fromUserId,
                                        photoURL: conversation.fromUserId.photoURL.toString(),
                                        displayName: conversation.fromUserId.displayName.toString(),
                                        conversationId: conversationId,
                                        notifications: notifyCount,
                                        status: conversation.fromUserId.status,
                                        lastSeen: conversation.fromUserId.updatedAt
                                    });
                                } else {
                                    interlocutorUsers.push({
                                        userId: recipient,
                                        photoURL: conversation.recipient.photoURL.toString(),
                                        displayName: conversation.recipient.displayName.toString(),
                                        conversationId: conversationId,
                                        notifications: notifyCount,
                                        status: conversation.recipient.status,
                                        lastSeen: conversation.fromUserId.updatedAt
                                    });
                                }
                            });
                            resolve(interlocutorUsers);
                    });

                }
            });
    });

});

conversationSchema.static('findConversationById', (conversationId: string | Schema.Types.ObjectId, userId: string | Schema.Types.ObjectId) => {
    return new Promise((resolve, reject) => {
        Conversation.find({_id: conversationId},
            '_id fromUserId recipient',
            {sort: {updatedAt: -1}})
            .populate('recipient fromUserId', '_id photoURL displayName status updatedAt')
            .exec((err: Error, conversations: any) => {
                if(err) {
                    reject(err);
                } else {
                    let interlocutorUsers;
                    conversations.map((conversation) => {
                        const conversationId = conversation._id.toString();
                        const fromUserId = conversation.fromUserId._id.toString();
                        const recipient = conversation.recipient._id.toString();

                        if (fromUserId === userId.toString()) {
                            interlocutorUsers = {
                                userId: fromUserId,
                                photoURL: conversation.fromUserId.photoURL.toString(),
                                displayName: conversation.fromUserId.displayName.toString(),
                                conversationId: conversationId,
                                notifications: 1,
                                status: conversation.fromUserId.status,
                                lastSeen: conversation.fromUserId.updatedAt,
                                newNotification : true
                            };
                        } else {
                            interlocutorUsers = {
                                userId: recipient,
                                photoURL: conversation.recipient.photoURL.toString(),
                                displayName: conversation.recipient.displayName.toString(),
                                conversationId: conversationId,
                                notifications: 1,
                                status: conversation.recipient.status,
                                lastSeen: conversation.fromUserId.updatedAt,
                                newNotification : true
                            };
                        }
                    });
                    resolve(interlocutorUsers);
                }
            });
    });
});

export type ConversationModel = Model<IConversation> & IConversationModel & IConversation;

export const Conversation: ConversationModel = <ConversationModel>model<IConversation>("Conversation", conversationSchema);
