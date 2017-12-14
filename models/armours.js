'use strict';

let request = require('../lib/request');

const root = '/armours';

module.exports.root = async (req) => {
    return await request.get(req, root);
};

module.exports.id = async (req, id) => {
    let route = root + '/' + id;

    try {
        let object = await request.get(req, route);

        object.result.attributes = await request.relation(req, route, 'attributes');
        object.result.primals = await request.relation(req, route, 'primals');
        object.result.skills = await request.relation(req, route, 'skills');

        return object;
    } catch(e) {
        return e;
    }
};