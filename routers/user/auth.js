const express = require('express');
const auth = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require('../../models/user');
const googleService = require('../../services/google.service');
const environment = require('../../environment/environment');

auth.post('/', (req, res) => {
    new googleService(req.body.accessToken, req.body.refreshToken)
        .getGUser((err, gUser) => {
            if (err) {
                res.json({success: false, msg: 'Authentication failed.  User not found.'});
            } else {
                UserModel.createOrUpdateUser(req.body, (err, success) => {
                    if (err) {
                        res.json({success: false, msg: 'unable to create/update user'});
                    } else {
                        UserModel.findOne({uid: gUser.id}, (err, user) => {
                            const token = jwt.sign(user,
                                environment.ApplicationSecret, {
                                expiresIn: 604800 // 1 week
                            });
                            res.json({success: true, token: token});
                        });
                    }
                });
            }
        });
});

module.exports = auth;
