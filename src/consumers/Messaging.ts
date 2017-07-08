import * as dotenv from 'dotenv';
import * as amqp from 'amqplib/callback_api';
import * as mongoose from 'mongoose';
import { Messages } from '../models/messages';
import { Notification } from '../models/notification';
import { Conversation } from '../models/conversation';

export class MessagingConsumer {

    private static instance: MessagingConsumer;

    public static bootstrapConsumer(): MessagingConsumer {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.setEnvironment();
        this.database();
        this.process();
    }

    private process(): void {
        amqp.connect(process.env.AMQP_HOST, (err, conn) => {
            conn.createChannel((err, ch) => {
                const q = 'messaging';
                ch.assertQueue(q, {durable: false});
                ch.consume(q, (msg) => {
                    const conversationData = JSON.parse(msg.content.toString());
                    Conversation.findOne({ _id: conversationData.id },(err, conversation) => {
                        if (err) {
                            //@TODO save to log
                        } else {
                            Messages.create({
                                senderId: conversationData.senderId,
                                conversationId: conversation._id,
                                messageBody: conversationData.message,
                                updatedAt: conversationData.updatedAt
                            },(err, message) =>{
                                if (err) {
                                    //@TODO save to log
                                    console.log(err);
                                } else {
                                    const userToId = conversation.fromUserId.toString() === conversationData.senderId.toString()
                                                     ? conversation.recipient.toString()
                                                     : conversation.fromUserId.toString();

                                    if (conversation.type === 'direct') {
                                        Notification.create({
                                            conversationId: conversation._id,
                                            messageId: message._id,
                                            fromUserId: conversationData.senderId,
                                            toUserId: userToId
                                        }, (err, notification) => {
                                            if (err) {
                                                //@TODO save to log
                                                console.log(err);
                                            }
                                        });
                                    } else {

                                    }
                                }
                            });
                        }
                    });
                }, {noAck: true});
            });
        });
    }

    private database(): void {
        mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    }


    private setEnvironment(): void {
        if (process.env.NODE_ENV === 'test') {
            dotenv.config({ path: "../../.env.test" });
        } else {
            dotenv.config({ path: "../../.env" });
        }
    }

}

MessagingConsumer.bootstrapConsumer();