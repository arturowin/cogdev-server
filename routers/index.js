/**
 * application main router
 */
const express     = require('express');
const api         = new express.Router();
const userRouter    = require('./user');

api.use('/user', userRouter);

module.exports = api;