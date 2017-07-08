import * as http from 'http';
import * as debug from 'debug';
import * as socketIo from 'socket.io';
import * as redis from 'redis';
import App  from './App';
import {socketGuard} from './middleware/socketGuard';
import {EventRegister} from "./events/EventRegister";

class Server {

    private server: any;
    private io: any;
    private port: number;
    private redis: any;

    public getServerInstance(): any {
        return this.server;
    }

    public createRedisInstance(): void {
        this.redis = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
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
        this.createRedisInstance();
        this.IoInit();
    }

    private IoInit(): void {
        this.io = socketIo(this.server);
        this.io.use(socketGuard);
        this.io.on('connect', (socket: any) => {
            EventRegister.bootstrapEventRegister(this.io, socket, this.redis);
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