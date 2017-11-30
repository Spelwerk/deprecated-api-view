'use strict';

let request = require('request'),
    nconf = require('nconf');

const uri = nconf.get('crud-uri');

module.exports = function(req, route, callback) {
    let options = {
        uri: uri + route,
        json: true,
        headers: req.headers
    };

    request.get(options, function(err, res, body) {
        callback(err, body);
    });
};
