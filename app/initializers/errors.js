'use strict';

const logger = require(appRoot + '/lib/logger');

async function setup(app) {
    logger.info('[ERRORS] Initializing');

    try {
        app.use(function(err, req, res, next) {
            let status = err.status || 500;

            req.log.error = err;

            logger.error(req.log);

            if(environment !== 'production') console.error(req.log);

            res.status(status).send(err);
        });
    } catch(e) {
        throw e;
    }
}

module.exports = setup;
