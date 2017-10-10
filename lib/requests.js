'use strict';

let request = require('request'),
    nconf = require('nconf');

const apiKeyId = nconf.get('api-key:id'),
      apiKeySecret = nconf.get('api-key:secret'),
      uri = nconf.get('crud-uri'),
      auth = new Buffer(apiKeyId + ':' + apiKeySecret).toString('base64');

module.exports = function(route, callback) {
    let req = { uri: uri + route, json: true, headers: { "Authorization": "Basic " + auth, "Content-Type": "application/json" } };

    request.get(req, function(err, res, body) {
        callback(err, res.statusCode, body);
    });
};
