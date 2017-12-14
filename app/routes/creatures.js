'use strict';

const model = require('../../models/creatures');

module.exports = function(router) {

    router.get("/", function(req, res, next) {
        model.root(req, function(err, creatures) {
            if(err) return next(err);

            res.status(200).send(creatures);
        })
    });

    router.get("/:id", function(req, res, next) {
        model.id(req, function(err, creature) {
            if(err) return next(err);

            res.status(200).send(creature);
        });
    });

};
