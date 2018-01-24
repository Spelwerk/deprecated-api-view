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
    return await request.get(req, route);
}

async function id(req, route, id) {
    try {
        let model = {};
        let schema = await request.get(req, route + '/schema');

        model.main = await request.single(req, route + '/' + id);
        model.permissions = await getPermissions(req, route, id);

        for(let i in schema.tables.hasMany) {
            let relation = schema.tables.hasMany[i];

            model[relation] = await request.relation(req, route + '/' + id, relation + '/value');
        }

        model.labels = await getLabels(req, route, id);
        model.comments = await getComments(req, route, id);

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