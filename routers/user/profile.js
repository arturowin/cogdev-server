const express = require('express');
const profile = express.Router();

profile.get('/all', (req, res) => {
    res.json({
        name : 'lorem',
        age: 25
    });
});

module.exports = profile;
