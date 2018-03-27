'use strict';

const request = require('../lib/request');
const utilities = require('../lib/utilities');
const config = require('../app/initializers/config');
const getSchema = require('../app/initializers/schema').get;

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function getPermissions(req, route, id) {
    let data;

    if (typeof req.headers['x-user-token'] !== 'undefined' && req.headers['x-user-token'] !== null) {
        data = await request.get(req, route + '/' + id + '/permissions');
    }

    if (!data) return null;

    return data;
}

async function getLabels(req, route, id) {
    let data;

    data = await request.multiple(req, route + '/' + id + '/labels');

    if (!data) return null;

    return data;
}

async function getComments(req, route, id) {
    let data;

    data = await request.multiple(req, route + '/' + id + '/comments');

    if (!data) return null;

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function user(req) {
    try {
        let user;

        if (typeof req.headers['x-user-token'] !== 'undefined' && req.headers['x-user-token'] !== null) {
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
        const singular = config.singular(route);
        const hasMany = getSchema(singular).tables.hasMany;

        let item = await request.single(req, slashRoute + '/' + id);

        item = utilities.splitUnderscoreInItem(item);

        model[singular] = item;

        for (let i in hasMany) {
            let relation = hasMany[i];
            let relationRoute = config.get('plural')[relation];

            model[relationRoute] = await request.multiple(req, '/' + route + '/' + id + '/' + relationRoute);
        }

        model.permissions = await getPermissions(req, slashRoute, id);
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