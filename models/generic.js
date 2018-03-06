'use strict';

const request = require('../lib/request');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function getPermissions(req, route, id) {
    try {
        let data;

        if(typeof req.headers['x-user-token'] !== 'undefined' && req.headers['x-user-token'] !== null) {
            data = await request.get(req, route + '/' + id + '/permissions');
        }

        if(!data) return null;

        return data;
    } catch(e) { return e; }
}

async function getLabels(req, route, id) {
    try {
        let data;

        data = await request.multiple(req, route + '/' + id + '/labels');

        if(!data) return null;

        return data;
    } catch(e) { return e; }
}

async function getComments(req, route, id) {
    try {
        let data;

        data = await request.multiple(req, route + '/' + id + '/comments');

        if(!data) return null;

        return data;
    } catch(e) { return e; }
}

function splitUnderscore(item, keyName) {
    let object = {};

    for(let key in item) {
        if(key.indexOf(keyName) === -1) continue;

        let split = key.split('_')[1];

        object[split] = item[key];
        delete item[key];
    }

    return object;
}

function getSingleFromPlural(route, plural) {
    for(let single in plural) {
        if(!plural.hasOwnProperty(single)) continue;
        if(plural[single] !== route) continue;

        return single;
    }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function user(req) {
    try {
        let user;

        if(typeof req.headers['x-user-token'] !== 'undefined' && req.headers['x-user-token'] !== null) {
            user = await request.get(req, '/users/info');
        }

        return user;
    } catch(e) { return e; }
}

async function list(req, route) {
    return await request.get(req, '/' + route);
}

async function id(req, route, id) {
    let slashRoute = '/' + route;
    let model = {};

    try {
        let plural = await request.get(req, '/system/config/plural');
        let schema = await request.get(req, slashRoute + '/schema');

        let modelName = getSingleFromPlural(route, plural);
        let item = await request.single(req, slashRoute + '/' + id);

        for(let key in item) {
            if(key.indexOf('_') === -1) continue;
            let split = key.split('_')[0];

            item[split] = splitUnderscore(item, split);
        }

        model[modelName] = item;

        model.permissions = await getPermissions(req, slashRoute, id);

        for(let i in schema.tables.hasMany) {
            let relation = schema.tables.hasMany[i];
            let relationRoute = plural[relation];

            model[relationRoute] = await request.multiple(req, '/' + route + '/' + id + '/' + relationRoute + '/mini');
        }

        model.labels = await getLabels(req, slashRoute, id);
        model.comments = await getComments(req, slashRoute, id);

        return model;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.getPermissions = getPermissions;
module.exports.getLabels = getLabels;
module.exports.getComments = getComments;

module.exports.user = user;
module.exports.list = list;
module.exports.id = id;