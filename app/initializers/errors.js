'use strict';

const logger = require('../../lib/logger');

module.exports = (app) => {
    logger.info('[ERRORS] Initializing');

    app.use((err, req, res, next) => {
        let status = err.status || 500;

        req.log.error = err;

        logger.error(req.log);

        if (environment !== 'production') console.error(req.log);

        res.status(status).send(err);
    });
};
