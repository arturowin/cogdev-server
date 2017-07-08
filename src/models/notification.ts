import {Schema, Model, Document, model} from 'mongoose';


export interface INotification extends Document {
    conversationId: Schema.Types.ObjectId;
    messageId: Schema.Types.ObjectId;
    fromUserId: Schema.Types.ObjectId;
    toUserId: Schema.Types.ObjectId;
    seen: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const notificationSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Conversation',
    },
    messageId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Messages',
    },
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    seen: {
        type: Boolean,
        required: true,
        "default": false
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

export type NotificationModel = Model<INotification> & INotification;

export const Notification: NotificationModel = <NotificationModel>model<INotification>("Notification", notificationSchema);
