'use strict';

const model = require('../../models/armours');

module.exports = (router) => {

    router.get('/', async (req, res, next) => {
        try {
            let data = await model.root(req);

            res.status(200).send(data);
        } catch(e) {
            next(e);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            let data = await model.id(req, req.params.id);

            res.status(200).send(data);
        } catch(e) {
            next(e);
        }
    });

};
