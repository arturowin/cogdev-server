/**
 * application main router
 */
import * as express from 'express';
const api = express.Router();
import {default as userRouter} from './user';

api.use('/user', userRouter);

export default api;