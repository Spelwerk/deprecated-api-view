'use strict';

let async = require('async'),
    request = require('../lib/requests');

const route = '/creatures';

const routesArray = [
    "armours",
    "assets",
    "attributes",
    "backgrounds",
    "expertises",
    "forms",
    "gifts",
    "imperfections",
    "languages",
    "loyalties",
    "milestones",
    "primals",
    "shields",
    "skills",
    "species",
    "spells",
    "software",
    "dementations",
    "diseases",
    "traumas"
];

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
        weapons: null,
        manifestations: null
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

        // Manifestation
        function(callback) {
            let route = idRoute + "/manifestations";

            request(req, route, function(err, body) {
                if(err) return callback(err);

                if(body.results.length === 0) return callback();

                creature.manifestations = [];

                let array = body.results;

                for(let i in array) {
                    let manifestation = array[i];

                    let object = {id: null, name: null, description: null, icon: null, focus: {}};

                    for(let key in manifestation) {
                        if(key.indexOf("focus_") !== -1) continue;

                        object[key] = manifestation[key];
                    }

                    for(let key in manifestation) {
                        if(key.indexOf("focus_") === -1) continue;

                        let newKey = key.split("focus_")[1];

                        object.focus[newKey] = manifestation[key];
                    }

                    creature.manifestations.push(object);
                }

                callback();
            });
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

        // Bionics
        function(callback) {
            let route = idRoute + "/bionics";

            request(req, route, function(err, body) {
                if(err) return callback(err);

                let bionics = body.results;

                async.each(bionics, function(bionic, next) {
                    let eachRoute = route + "/" + bionic.id + "/augmentations";

                    request(req, eachRoute, function(err, body) {
                        if(err) return next(err);

                        bionic.augmentations = body.results;

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
            let route = idRoute + "/weapons";

            request(req, route, function(err, body) {
                if(err) return callback(err);

                let weapons = body.results;

                async.each(weapons, function(weapon, next) {
                    let modRoute = route + "/" + weapon.id + "/mods";

                    request(req, modRoute, function(err, body) {
                        if(err) return next(err);

                        weapon.mods = body.results;

                        next();
                    });
                }, function(err) {
                    if(err) return callback(err);

                    creature.weapons = weapons;

                    callback();
                });
            });
        },

        // Other
        function(callback) {
            async.each(routesArray, function(routeName, next) {
                let route = idRoute + "/" + routeName;

                request(req, route, function(err, body) {
                    if(err) return next(err);

                    creature[routeName] = body.results;

                    next();
                });
            }, function(err) {
                callback(err);
            });
        }
    ], function(err) {
        callback(err, creature);
    });
};