'use strict';

let request = require('./../../lib/requests');

module.exports = function(router) {
    const crudRoute = '/users';

    router.get("/", function(req, res, next) {
        request(crudRoute, function(err, status, body) {
            if(err) return next(err);

            res.status(status).send(body);
        });
    });

};
