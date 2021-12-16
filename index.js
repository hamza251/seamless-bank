const config = require('./common/config/env.config.js');
const express = require('express');
const app = express();
const BanksRouter = require('./src/banks/routes.config');

// initialize some default enviornment variables
process.env.BALANCE = 100000;

app.use(express.json());
// set the prefix of the route
app.use('/v1/api', BanksRouter)

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});