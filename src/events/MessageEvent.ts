import {BaseEvent} from './BaseEvent';
import {Conversation as ConversationModel} from '../models/conversation';
import * as amqp from 'amqplib/callback_api';

export class MessageEvent extends BaseEvent {

    onJoinConversationEvent(): void {
        this.socket.on('join-conversation', (conversation) => {
            ConversationModel.findOne({_id: conversation, $and: [ { $or: [
                {fromUserId: this.socket.user._id},
                {recipient: this.socket.user._id} ] } ] }, (err, conversation) => {
                if (err) {
                    this.socket.emit('conversation-permission-denied');
                } else if (conversation) {
                    this.socket.join(conversation._id);
                    this.socket.emit('joined', conversation._id);
                    console.log('joined', conversation._id);
                }
            });
        });
    }

    onLeaveConversationEvent(): void {
        this.socket.on('leave-conversation', (conversation) => {
            this.socket.leave(conversation);
        });
    }

    onNewMessageEvent(): void {
        this.socket.on('new-message', (conversationData) => {
            this.socket.broadcast.to(conversationData.id).emit('refresh-messages', conversationData.message);
            amqp.connect('amqp://localhost', (err, conn) => {
                conn.createChannel((err, ch) => {
                    const q = 'default';
                    ch.assertQueue(q, {durable: false});
                    ch.sendToQueue(q, new Buffer(conversationData));
                    ch.close((err)=>{
                        console.log(err);
                    });
                });
            });

        });
    }

}