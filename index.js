const environment = require('./environment/environment');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport = require('passport');
const guard = require('./middleware/guard');
/**
 * database connect
 */
mongoose.connect(`mongodb://${environment.DB.user}:${environment.DB.password}@ds151461.mlab.com:51461/coglite`);

mongoose.connection.on('connected', () => {
    console.log('database is connected');
});

mongoose.connection.on('error', (err) => {
    console.log(`database connection error ${err}`);
});

/**
 * CORS middleware --**development only**--
 * @param req
 * @param res
 * @param next
 */
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        res.status(200).send();
    } else {
        next();
    }
};

app.use(bodyParser.json());
app.use(helmet());
app.use(allowCrossDomain);

/**
 * passport initialize
 */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


/**
 * require application main {v1} router
 */
const apiRouter = require('./routers');
app.use(guard);
app.use('/v1', apiRouter);
app.use('/', (req, res) => {
    res.status(404).send({ error: `path doesn't exist`});
});

/**
 * run application
 */
app.listen(environment.PORT, () => {
    console.log(`${environment.AppName} listening on port ${environment.PORT}!`);
});
