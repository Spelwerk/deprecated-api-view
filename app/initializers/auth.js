'use strict';

const nconf = require('nconf');
const basicAuth = require('basic-auth');
const logger = require('../../lib/logger');

module.exports = async (app) => {
    logger.info('[AUTH] Initializing');

    try {
        app.use((req, res, next) => {
            let credentials = basicAuth(req);

            if (!credentials || credentials.name !== nconf.get('api-key:id') || credentials.pass !== nconf.get('api-key:secret')) return next({status: 403, message: 'Faulty API credentials', error: 'The credentials in basic auth were not correct.'});

            next();
        });
    } catch(e) { throw e; }
};
