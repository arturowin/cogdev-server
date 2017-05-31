/**
 * user router
 */
const express     = require('express');
const user         = new express.Router();
const authRouter    = require('./auth');
const profileRouter    = require('./profile');
const groupRouter    = require('./group');

user.use('/auth', authRouter);
user.use('/profile', profileRouter);
user.use('/group', groupRouter);

module.exports = user;