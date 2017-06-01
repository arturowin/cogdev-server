const jwt = require('jsonwebtoken');
const environment = require('../environment/environment');
const guard = module.exports = (req, res, next) => {

    if(req.originalUrl === `/${environment.apiVersion}/${environment.authPath}`){
        next();
    } else {
        const token = req.headers['authorization'];
        if (token) {
            jwt.verify(token, environment.ApplicationSecret, (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};