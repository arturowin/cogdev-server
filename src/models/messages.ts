import {Schema, Model, Document, model} from 'mongoose';


export interface IMessages extends Document {
    user?: any;
    senderId: string;
    conversationId: string;
    messageBody: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface IMessagesModel {
    createOrUpdate(upsertData: any, callback: any): void
}

const messagesSchema = new Schema({
    senderId: {
        type: String,
        required: true,
        ref: 'User'
    },
    conversationId: {
        type: String,
        required: true,
        ref: 'Conversation',
    },
    messageBody: {
        type: String,
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

messagesSchema.static('createOrUpdate', (upsertData: any, callback: any) => {
    Messages.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
});

export type MessagesModel = Model<IMessages> & IMessagesModel & IMessages;

export const Messages: MessagesModel = <MessagesModel>model<IMessages>("messages", messagesSchema);