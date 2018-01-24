'use strict';

const generic = require('../../lib/generic');
const model = require('../../models/creatures');

module.exports = function(router) {

    router.route('/')
        .get(async (req, res, next) => {
            try {
                let result = {};
                result.user = await generic.user(req);
                result.model = await model.list(req);

                res.status(200).send(result);
            } catch(e) {
                next(e);
            }
        });

    router.route('/:id')
        .get(async (req, res, next) => {
            try {
                let result = {};
                result.user = await generic.user(req);
                result.model = await model.id(req, req.params.id);

                res.status(200).send(result);
            } catch(e) {
                next(e);
            }
        });

};
