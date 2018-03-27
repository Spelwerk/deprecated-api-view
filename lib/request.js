'use strict';

const request = require('request-promise-native');
const nconf = require('nconf');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function get(req, route, options) {
    options = options || {
        uri: nconf.get('crud-uri') + route,
        json: true,
        headers: req.headers
    };

    return await request.get(options);
}

async function single(req, route) {
    let data = await get(req, route);

    if (!data.result) return null;

    return data.result;
}

async function multiple(req, route) {
    let data = await get(req, route);

    if (!data.results) return [];

    return data.results;
}

module.exports.get = get;
module.exports.single = single;
module.exports.multiple = multiple;