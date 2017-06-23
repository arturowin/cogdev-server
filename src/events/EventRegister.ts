import { MessageEvent } from './MessageEvent'

export class EventRegister {

    private io;
    private socket;

    public static bootstrapEventRegister(io: any, socket: any) {
            new EventRegister(io,socket);
    }

    private constructor(io: any, socket: any) {
       this.io = io;
       this.socket = socket;
       this.eventRegister();
    }

    /**
     * register Custom events here
     */
    eventRegister() {
        new MessageEvent(this.io, this.socket);
    }

}