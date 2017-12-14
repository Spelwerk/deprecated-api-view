'use strict';

const nconf = require('nconf');
const logger = require(appRoot + '/lib/logger');

async function setup() {
    logger.info('[NCONF] Initializing');

    try {
        require('dotenv').load();
        nconf.file({file: appRoot + '/config/' + environment + '.yml', format: require('nconf-yaml')});
        nconf.env();
        nconf.argv();
    } catch(e) {
        throw e;
    }
}

module.exports = setup;
