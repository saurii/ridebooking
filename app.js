const express = require('express');
const responseapi = require('./server/commanfunction').responseapi
const _config = require('./server/config/index')._config;
const Statuscodes = require('./server/utils/statuscodeconstant').Statuscodes;

const routesV1 = require('./server/api/routes');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", _config.server.connections.routes.cors);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, userid, secretuser");
    res.header("Access-Control-Allow-Methods", "POST");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

// Routes
app.use(_config.internals.apiendpoint, routesV1);
let statuscodeObj = new Statuscodes();
// catch 404 and forward to error handler
app.use((req, res, next) => next(res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('400')))));

// Middleware Error Handler
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(err.message);
    }
});

module.exports = app;