'use strict';

const uuid = require('uuid/v1');
const logger = require('../../lib/logger');

module.exports = (app) => {
    logger.info('[LOG] Initializing');

    app.use(function(req, res, next) {
        req.log = {
            id: uuid(),
            host: req.headers['host'],
            agent: req.headers['user-agent'],
            method: req.method,
            remoteAddress: req.connection.remoteAddress,
            body: {}
        };

        for(let key in req.body) {
            if(key === 'password') continue;

            req.log.body[key] = req.body[key];
        }

        next();
    });
};