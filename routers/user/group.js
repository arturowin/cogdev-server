const express = require('express');
const group = express.Router();
const GroupModel = require('../../models/group');

group.post('/create', (req, res) => {
    GroupModel.create(req.body, (err, group) => {
        if (err) {
            console.log(err);
            res.json({success: false, msg:'unable to create'});
        } else {
            res.json(group);
        }
    })
});

module.exports = group;
