import {Schema, Model, Document, model} from 'mongoose';


export interface IConversation extends Document {
    type: string;
    fromUserId: Schema.Types.ObjectId;
    recipient: Schema.Types.ObjectId,
    updatedAt: Date;
    createdAt: Date;
}

export interface IConversationModel {
    createOrUpdate(upsertData: any, callback: any): void
    findOneOrCreate(data: any, callback: Function): void
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
        required: true
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


export type ConversationModel = Model<IConversation> & IConversationModel & IConversation;

export const Conversation: ConversationModel = <ConversationModel>model<IConversation>("Conversation", conversationSchema);
