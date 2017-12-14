'use strict';

const logger = require(appRoot + '/lib/logger');

async function setup(app) {
    logger.info('[ERRORS] Initializing');

    try {
        app.use(function(err, req, res, next) {
            let status = err.status || 500,
                title = err.title || 'Error',
                message = err.message || 'Message',
                details = err.details || 'Details';

            req.log.error = err;

            logger.error(req.log);

            if(environment !== 'production') console.error(req.log);

            res.status(status).send({title: title, message: message, details: details});
        });
    } catch(e) {
        throw e;
    }
}

module.exports = setup;
