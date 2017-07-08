import { MessageEvent } from './MessageEvent'
import { User } from '../models/user';
export class EventRegister {

    private io;
    private socket;
    private redis;

    public static bootstrapEventRegister(io: any, socket: any, redis: any) {
            new EventRegister(io, socket, redis);
    }

    private constructor(io: any, socket: any, redis: any) {
       this.redis = redis;
       this.io = io;
       this.socket = socket;
       this.onConnect();
       this.eventRegister();
       this.onDisconnect();
    }

    private onConnect(): void {
        this.redis.get(this.socket.user._id.toString(), (err, socketStore) => {
           if(err) {
               // TODO log err
           } else {
               if (socketStore) {
                   socketStore = JSON.parse(socketStore);
                   socketStore.socketIds.push(this.socket.id);
                   this.redis.set(this.socket.user._id.toString(), JSON.stringify(socketStore));
               } else {
                   this.redis.set(this.socket.user._id.toString(), JSON.stringify({socketIds: [this.socket.id]}));
               }
           }
        });
        User.findOne({_id: this.socket.user._id}, (err, user) => {
            const devicesCount = user.activeDevices + 1 || 1;
            User.findOneAndUpdate({_id: this.socket.user._id},{$set: {activeDevices: devicesCount, status: 'online', updatedAt: Date.now()}},(err, user) => {
                if (err) {
                    this.socket.emit('error');
                } else {
                    console.log('client connected');
                }

            });
        });
    }

    private onDisconnect(): void {
        this.socket.on('disconnect', () => {
            this.redis.get(this.socket.user._id.toString(), (err, socketStore) => {
                if(err) {
                    // TODO log err
                } else {
                    if (socketStore) {
                        socketStore = JSON.parse(socketStore);
                        const index = socketStore.socketIds.indexOf(this.socket.id);
                        socketStore.socketIds.splice(index, 1);
                        if(socketStore.activeDevices === 0) {
                            this.redis.del(this.socket.user._id.toString());
                        } else {
                            this.redis.set(this.socket.user._id.toString(), JSON.stringify(socketStore));
                        }
                    }
                }
            });
            User.findOne({_id: this.socket.user._id},(err, user) => {
                const devicesCount = user.activeDevices -1 || 0;
                const status = devicesCount ? 'online' : 'offline';
                User.findOneAndUpdate({_id: this.socket.user._id},{$set: {activeDevices: devicesCount, status: status, updatedAt: Date.now()}},(err, user) => {
                    if (err) {
                        this.socket.emit('error');
                    } else {
                        console.log('Client disconnected');
                    }
                });
            });

        });
    }

    /**
     * register Custom events here
     */
    eventRegister() {
        new MessageEvent(this.io, this.socket, this.redis);
    }

}