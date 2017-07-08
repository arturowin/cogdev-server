import {BaseEvent} from './BaseEvent';
import {Conversation as ConversationModel} from '../models/conversation';
import * as amqp from 'amqplib/callback_api';
import {User as UserModel} from '../models/user';
import {Notification} from '../models/notification';

export class MessageEvent extends BaseEvent {

    onGetInterlocutorsEvent(): void {
        this.socket.on('get-conversations', (offset) => {
            const limit = 15;
            offset = parseInt(offset);
            ConversationModel.getConversations(this.socket.user._id, offset, limit).then((interlocutorUsers)=>{
                this.socket.emit('conversation-list',{type: 'conversations', conversationList: interlocutorUsers,conversationCount: 80});
            });
        });
    }

    onJoinConversationEvent(): void {
        this.socket.on('join-conversation', (conversation) => {
            ConversationModel.findOne({_id: conversation, $and: [ { $or: [
                {fromUserId: this.socket.user._id},
                {recipient: this.socket.user._id},
                ]} ] }, (err, conversation) => { //{group: {$elemMatch: {$eq: this.socket.user._id} } }
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

    onTypingEvent(): void {
        this.socket.on('typing', (conversation) => {
            console.log('typing');
            this.socket.broadcast.to(conversation.id).emit('typing', {
                type: 'typing',
                conversationId: conversation.id,
                userId: this.socket.user._id,
                user: this.socket.user.displayName
            });
        });
    }

    onStoppedTypingEvent(): void {
        this.socket.on('stopped-typing', (conversation) => {
            console.log('stopped typing');
            this.socket.broadcast.to(conversation.id).emit('stopped-typing',{
                type: 'stopped-typing',
                conversationId: conversation.id,
                userId: this.socket.user._id
            })
        });
    }

    onLeaveConversationEvent(): void {
        this.socket.on('leave-conversation', (conversation) => {
            this.socket.leave(conversation);
        });
    }

    onNewMessageEvent(): void {
        this.socket.on('new-message', (conversationData) => {
            conversationData.senderId = this.socket.user._id;
            conversationData.updatedAt =  Date.now();
            this.socket.broadcast.to(conversationData.id).emit('refresh-messages',
                {
                    type: 'new-message',
                    senderId: conversationData.senderId,
                    conversationId: conversationData.id,
                    message: conversationData.message,
                    updatedAt: Date.now(),
                    displayName: this.socket.user.displayName,
                    photoURL: this.socket.user.photoURL
                });
            this.redis.get(conversationData.userId.toString(), (err, socketStore) => {
                if (socketStore) {
                    socketStore = JSON.parse(socketStore);
                    ConversationModel.findConversationById(conversationData.id, this.socket.user._id)
                        .then((interlocutorUsers) => {
                            socketStore.socketIds.map((id) => {
                                this.socket.to(id).emit('notification', {type: 'notification', conversationList: interlocutorUsers});
                            });
                        });
                }
            });
            amqp.connect(process.env.AMQP_HOST, (err, conn) => {
                conn.createChannel((err, ch) => {
                    const q = 'messaging';
                    ch.assertQueue(q, {durable: false});
                    ch.sendToQueue(q, new Buffer(JSON.stringify(conversationData)));
                    console.log(" [x] Sent", conversationData);
                });
                setTimeout(() => { conn.close()}, 500);
            });
        });
    }

    onStatusCheckEvent(): void {
        this.socket.on('check-status', (data) => {
            UserModel.find({_id: { $in: data }}, '_id status updatedAt', (err: Error, users: any) => {
                if (users) {
                    this.socket.to(this.socket.id).emit('status', {type: 'status', users: users});
                }
            });
        });
    }

    onMessageReadEvent(): void {
        this.socket.on('mark-as-read', (conversationId) => {
            Notification.update({conversationId: conversationId, toUserId: this.socket.user._id}, {seen: true}, {multi: true});
        });
    }

}