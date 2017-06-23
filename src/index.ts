import * as http from 'http';
import * as debug from 'debug';
import * as socketIo from 'socket.io';
import App  from './App';
import {socketGuard} from './middleware/socketGuard';
import {EventRegister} from "./events/EventRegister";

class Server {

    private server: any;
    private io: any;
    private port: number;

    public getServerInstance(): any {
        return this.server;
    }


    public static bootstrap(): Server {
        return new Server();
    }


    private debugMod(): void {
        debug('ts-express:server');
    }

    constructor() {
        this.debugMod();
        this.runServer();
    }

    private runServer(): void {
        this.port = this.normalizePort(process.env.PORT || 3500);
        App.set('port', this.port);
        this.createServer();
        this.IoInit();
    }

    private IoInit(): void {
        this.io = socketIo(this.server);
        this.io.use(socketGuard);
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port');
            EventRegister.bootstrapEventRegister(this.io, socket);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

    }

    private createServer() {
        this.server = http.createServer(App);
        this.server.listen(this.port);
        this.server.on('listening', () => {
            let address = server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            debug(`Listening on ${bind}`);
        });
        this.server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') throw error;
            console.error(error);
            process.exit(1);
        });
    }

    private normalizePort(val: number|string): number {
        let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
        return port;
    }

}

export const server = Server.bootstrap().getServerInstance();