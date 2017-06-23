/**
 * application main router
 */
import * as express from 'express';
const api = express.Router();
import {default as userRouter} from './user';
import {default as messagingRouter} from './messaging';

api.use('/user', userRouter);
api.use('/messaging', messagingRouter);

export default api;