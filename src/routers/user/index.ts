/**
 * user router
 */
import * as express from 'express';
const user = express.Router();
import {Auth} from './Auth';
import {Profile} from './Profile';
import {Group} from './Group';

user.use('/auth', new Auth().getRoutes());
user.use('/profile', new Profile().getRoutes());
user.use('/group', new Group().getRoutes());

export default user;