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
    } catch(e) {
        return e;
    }
}

async function relation(req, route, relation) {
    try {
        let array = [];

        let results = await get(req, route + '/' + relation);

        results = results.results;

        for(let i in results) {
            array.push(results[i]);
        }

        return array;
    } catch(e) {
        return e;
    }
}

module.exports.get = get;
module.exports.relation = relation;
