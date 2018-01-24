'use strict';

const generic = require('./generic');
const request = require('../lib/request');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function id(req, route, id) {
    try {
        return {
            main: await request.single(req, route + '/' + id),
            permissions: await generic.getPermissions(req, route, id),
            armour: await request.relation(req, route + '/' + id, 'armour/name'),
            asset: await request.relation(req, route + '/' + id, 'asset/value'),
            attribute: await request.relation(req, route + '/' + id, 'attribute/value'),
            bionic: await request.relation(req, route + '/' + id, 'bionic/name'),
            primal: await request.relation(req, route + '/' + id, 'primal/value'),
            shield: await request.relation(req, route + '/' + id, 'shield/name'),
            skill: await request.relation(req, route + '/' + id, 'skill/value'),
            weapon: await request.relation(req, route + '/' + id, 'weapon/name'),
            labels: await generic.getLabels(req, route, id),
            comments: await generic.getComments(req, route, id)
        };
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.id = id;