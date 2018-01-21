'use strict';

const request = require('request-promise-native');
const nconf = require('nconf');

async function get(req, route) {
    try {
        let options = {
            uri: nconf.get('crud-uri') + route,
            json: true,
            headers: req.headers
        };

        return await request.get(options);
    } catch(e) { return e; }
}

async function single(req, route) {
    let data = await get(req, route);

    if(!data.result) return null;

    return data.result;
}

async function multiple(req, route) {
    let data = await get(req, route);

    if(!data.results) return [];

    return data.results;
}

async function relation(req, route, relation) {
    return await multiple(req, route + '/' + relation);
}

module.exports.get = get;
module.exports.single = single;
module.exports.multiple = multiple;
module.exports.relation = relation;
