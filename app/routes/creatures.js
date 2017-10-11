'use strict';

let async = require('async');

let request = require('./../../lib/requests');

module.exports = function(router) {
    const route = '/creatures';

    router.get("/", function(req, res, next) {
        request(req, route, function(err, status, body) {
            if(err) return next(err);

            res.status(status).send(body);
        });
    });

    router.get("/:id", function(req, res, next) {
        let idRoute = route + "/" + req.params.id;

        let creature = {};

        async.series([
            // Creature
            function(callback) {
                request(req, idRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.creature = body.result;

                    callback();
                });
            },
            // Permissions
            function(callback) {
                let newRoute = idRoute + "/permissions";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature["permissions"] = body.results;

                    callback();
                });
            },
            // Labels
            function(callback) {
                let newRoute = idRoute + "/labels";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature["labels"] = body.results;

                    callback();
                });
            },
            // Comments
            function(callback) {
                let newRoute = idRoute + "/comments";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature["comments"] = body.results;

                    callback();
                });
            },
            // Relations
            function(callback) {
                let routesArray = [
                    "assets",
                    "attributes",
                    "augmentations",
                    "backgrounds",
                    "bionics",
                    "doctrines",
                    "expertises",
                    "gifts",
                    "imperfections",
                    "languages",
                    "loyalties",
                    "manifestations",
                    "milestones",
                    "protection",
                    //"relations",
                    "skills",
                    "species",
                    "software",
                    "dementations",
                    "diseases",
                    "traumas"
                ];

                async.each(routesArray, function(routeName, next) {
                    let newRoute = idRoute + "/" + routeName;

                    request(req, newRoute, function(err, stat, body) {
                        if(err) return next(err);

                        creature[routeName] = body.results;

                        next();
                    });
                }, function(err) {
                    callback(err);
                });
            },
            function(callback) {
                let newRoute = idRoute + "/weapons";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    let weapons = body.results;

                    async.each(weapons, function(weaponObject, next) {
                        let modRoute = newRoute + "/" + weaponObject.id + "/mods";

                        request(req, modRoute, function(err, stat, body) {
                            if(err) return next(err);

                            weaponObject["mods"] = body.results;

                            next();
                        });
                    }, function(err) {
                        if(err) return callback(err);

                        creature["weapons"] = weapons;

                        callback();
                    });
                });
            }
        ], function(err) {
            if(err) return next(err);

            res.status(200).send(creature);
        });

    });

};
