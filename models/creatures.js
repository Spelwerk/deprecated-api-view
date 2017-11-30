'use strict';

let async = require('async'),
    request = require('../lib/requests');

const route = '/creatures';

module.exports.root = function(req, callback) {
    request(req, route, callback);
};

module.exports.id = function(req, callback) {
    let idRoute = route + "/" + req.params.id;

    let creature = {
        creature: null,
        world: null,
        corporation: null,
        country: null,
        identity: null,
        nature: null,
        wealth: null,
        permissions: null,
        labels: null,
        comments: null,
        bionics: null,
        weapons: null
    };

    async.series([
        // Creature
        function(callback) {
            request(req, idRoute, function(err, body) {
                if(err) return callback(err);

                creature.creature = body.result;

                callback();
            });
        },
        // Permissions
        function(callback) {
            if(!req.headers["x-user-token"]) return callback();

            let newRoute = idRoute + "/permissions";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.permissions = body;

                callback();
            });
        },
        // Labels
        function(callback) {
            let newRoute = idRoute + "/labels";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.labels = body.results;

                callback();
            });
        },
        // Comments
        function(callback) {
            let newRoute = idRoute + "/comments";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.comments = body.results;

                callback();
            });
        },
        // World
        function(callback) {
            let newRoute = idRoute + "/world";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.world = body.result;

                callback();
            });

            callback();
        },
        // Corporation
        function(callback) {
            let newRoute = idRoute + "/corporation";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.corporation = body.result;

                callback();
            });

            callback();
        },
        // Country
        function(callback) {
            let newRoute = idRoute + "/country";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.country = body.result;

                callback();
            });

            callback();
        },
        // Identity
        function(callback) {
            let newRoute = idRoute + "/identity";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.identity = body.result;

                callback();
            });

            callback();
        },
        // Nature
        function(callback) {
            let newRoute = idRoute + "/nature";

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                creature.nature = body.result;

                callback();
            });

            callback();
        },
        // Wealth
        function(callback) {
            let newRoute = idRoute + "/wealth";

            request(req, newRoute, function(err, body) {
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
                "forms",
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
                "spells",
                "software",
                "dementations",
                "diseases",
                "traumas"
            ];

            async.each(routesArray, function(routeName, next) {
                let newRoute = idRoute + "/" + routeName;

                request(req, newRoute, function(err, body) {
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

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                let bionics = body.results;

                async.each(bionics, function(bionicObject, next) {
                    let augRoute = newRoute + "/" + bionicObject.id + "/augmentations";

                    request(req, augRoute, function(err, body) {
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

            request(req, newRoute, function(err, body) {
                if(err) return callback(err);

                let weapons = body.results;

                async.each(weapons, function(weaponObject, next) {
                    let modRoute = newRoute + "/" + weaponObject.id + "/mods";

                    request(req, modRoute, function(err, body) {
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
        callback(err, creature);
    });
};