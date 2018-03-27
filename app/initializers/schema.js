'use strict';

const nconf = require('nconf');
const logger = require('../../lib/logger');
const request = require('request-promise-native');

logger.info('[SCHEMA] Initializing');

let dbSchema = {};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function setup() {
    try {
        dbSchema = await request.get({
            uri: nconf.get('crud-uri') + '/system/schema',
            auth: {
                user: nconf.get('api-key:id'),
                pass: nconf.get('api-key:secret')
            },
            json: true,
        });
    } catch(e) { throw e; }
}

function getSchema(tableName) {
    return dbSchema[tableName];
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.setup = setup;
module.exports.get = getSchema;