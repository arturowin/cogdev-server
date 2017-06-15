import * as http from 'http';
import * as debug from 'debug';
import * as dotenv from 'dotenv';


if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config({ path: ".env" });
}

import App from './App';

debug('ts-express:server');

const port = normalizePort(process.env.PORT || 3500);
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    console.error(error);
    process.exit(1);
}

function onListening(): void {
    let address = server.address();
    let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
    debug(`Listening on ${bind}`);
}


export default server;