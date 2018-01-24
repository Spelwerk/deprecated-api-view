'use strict';

const generic = require('../../models/generic');
const model = require('../../models/mileGround');

module.exports = (router, name) => {
    const route = '/' + name;

    router.get('/', async (req, res, next) => {
        try {
            let result = {};
            result.user = await generic.user(req);
            result.model = await generic.list(req, route);

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            let result = {};
            result.user = await generic.user(req);
            result.model = await model.id(req, route, req.params.id);

            res.status(200).send(result);
        } catch(e) { next(e); }
    });
};
