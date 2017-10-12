'use strict';

let async = require('async'),
    request = require('../../lib/requests'),
    creatureModel = require('../../models/creatures');

module.exports = function(router) {
    router.get("/", function(req, res, next) {
        creatureModel.root(req, function(err, creatures) {
            if(err) return next(err);

            res.status(200).send(creatures);
        })
    });

    router.get("/:id", function(req, res, next) {
        creatureModel.id(req, function(err, creature) {
            if(err) return next(err);

            res.status(200).send(creature);
        });
    });
};
