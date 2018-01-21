'use strict';

const model = require('../../models/armours');

module.exports = (router) => {

    router.route('/')
        .get(async (req, res, next) => {
            try {
                let data = await model.list(req);

                res.status(200).send(data);
            } catch(e) {
                next(e);
            }
        });

    router.route('/:id')
        .get(async (req, res, next) => {
            try {
                let data = await model.id(req, req.params.id);

                res.status(200).send(data);
            } catch(e) {
                next(e);
            }
        });

};
