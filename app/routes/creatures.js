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

        let creature = {
            creature: null,
            permissions: null,
            labels: null,
            comments: null,
            corporation: null,
            country: null,
            identity: null,
            nature: null,
            wealth: null,
            bionics: null,
            weapons: null
        };

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

                    creature.permissions = body;

                    callback();
                });
            },
            // Labels
            function(callback) {
                let newRoute = idRoute + "/labels";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.labels = body.results;

                    callback();
                });
            },
            // Comments
            function(callback) {
                let newRoute = idRoute + "/comments";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.comments = body.results;

                    callback();
                });
            },
            // Corporation
            function(callback) {
                if(!creature.creature.corporation_id) return callback();

                let newRoute = "/corporations/" + creature.creature.corporation_id;

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.corporation = body.result;

                    callback();
                });

                callback();
            },
            // Country
            function(callback) {
                if(!creature.creature.country_id) return callback();

                let newRoute = "/countries/" + creature.creature.country_id;

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.country = body.result;

                    callback();
                });

                callback();
            },
            // Identity
            function(callback) {
                if(!creature.creature.identity_id) return callback();

                let newRoute = "/identities/" + creature.creature.identity_id;

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.identity = body.result;

                    callback();
                });

                callback();
            },
            // Nature
            function(callback) {
                if(!creature.creature.nature_id) return callback();

                let newRoute = "/natures/" + creature.creature.nature_id;

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.nature = body.result;

                    callback();
                });

                callback();
            },
            // Wealth
            function(callback) {
                if(!creature.creature.wealth_id) return callback();

                let newRoute = "/wealth/" + creature.creature.wealth_id;

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    creature.wealth = body.result;

                    callback();
                });

                callback();
            },
            // Relations (creature_has_*)
            function(callback) {
                let routesArray = [
                    "assets",
                    "attributes",
                    "backgrounds",
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
            // Bionics
            function(callback) {
                let newRoute = idRoute + "/bionics";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    let bionics = body.results;

                    async.each(bionics, function(bionicObject, next) {
                        let augRoute = newRoute + "/" + bionicObject.id + "/augmentations";

                        request(req, augRoute, function(err, stat, body) {
                            if(err) return next(err);

                            bionicObject.augmentations = body.results;

                            next();
                        });
                    }, function(err) {
                        if(err) return callback(err);

                        creature.bionics = bionics;

                        callback();
                    });
                });
            },
            // Weapons
            function(callback) {
                let newRoute = idRoute + "/weapons";

                request(req, newRoute, function(err, stat, body) {
                    if(err) return callback(err);

                    let weapons = body.results;

                    async.each(weapons, function(weaponObject, next) {
                        let modRoute = newRoute + "/" + weaponObject.id + "/mods";

                        request(req, modRoute, function(err, stat, body) {
                            if(err) return next(err);

                            weaponObject.mods = body.results;

                            next();
                        });
                    }, function(err) {
                        if(err) return callback(err);

                        creature.weapons = weapons;

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
