'use strict';

let request = require('request'),
    nconf = require('nconf');

const apiKeyId = nconf.get('api-key:id'),
      apiKeySecret = nconf.get('api-key:secret'),
      uri = nconf.get('crud-uri'),
      auth = new Buffer(apiKeyId + ':' + apiKeySecret).toString('base64');

module.exports = function(req, route, callback) {
    let options = {
        uri: uri + route,
        json: true,
        headers: {
            "Authorization": "Basic " + auth
        }
    };

    if(req.headers["x-user-token"]) options.headers["x-user-token"] = req.headers["x-user-token"];
    if(req.headers["x-order-by"]) options.headers["x-order-by"] = req.headers["x-order-by"];
    if(req.headers["x-pagination-limit"]) options.headers["x-pagination-limit"] = req.headers["x-pagination-limit"];
    if(req.headers["x-pagination-amount"]) options.headers["x-pagination-amount"] = req.headers["x-pagination-amount"];

    request.get(options, function(err, res, body) {
        callback(err, res.statusCode, body);
    });
};
