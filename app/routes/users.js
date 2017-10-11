'use strict';

let request = require('./../../lib/requests');

module.exports = function(router) {
    const route = '/users';

    router.get("/", function(req, res, next) {
        request(req, route, function(err, status, body) {
            if(err) return next(err);

            res.status(status).send(body);
        });
    });

    router.get("/:id", function(req, res, next) {
        let newRoute = route + "/" + req.params.id;

        request(req, newRoute, function(err, status, body) {
            if(err) return next(err);

            res.status(status).send(body);
        });
    });

};
