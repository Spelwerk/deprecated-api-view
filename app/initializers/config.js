'use strict';

const nconf = require('nconf');
const logger = require('../../lib/logger');
const request = require('request-promise-native');

logger.info('[GAME CONFIG] Initializing');

let gameConfig = {};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function setup() {
    try {
        gameConfig = await request.get({
            uri: nconf.get('crud-uri') + '/system/config',
            auth: {
                user: nconf.get('api-key:id'),
                pass: nconf.get('api-key:secret')
            },
            json: true,
        });
    } catch(e) { throw e; }
}

function getConfig(objectName) {
    return gameConfig[objectName];
}

function getSingular(route) {
    const plural = gameConfig.plural;

    for (let single in plural) {
        if (!plural.hasOwnProperty(single)) continue;
        if (plural[single] !== route) continue;

        return single;
    }

    return null;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.setup = setup;
module.exports.get = getConfig;
module.exports.singular = getSingular;