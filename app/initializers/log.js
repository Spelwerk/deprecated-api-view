'use strict';

const uuid = require('uuid/v1');
const logger = require(appRoot + '/lib/logger');

async function setup(app) {
    logger.info('[LOG] Initializing');

    try {
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
    } catch(e) {
        throw e;
    }
}

module.exports = setup;