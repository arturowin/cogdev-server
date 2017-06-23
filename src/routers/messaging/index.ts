/**
 * messaging router
 */
import * as express from 'express';
const messaging = express.Router();
import {Message} from './Message';


messaging.use('/message', new Message().getRoutes());


export default messaging;