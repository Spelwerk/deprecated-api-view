'use strict';

const generic = require('../../models/generic');
const model = require('../../models/creatures/creatures');

const getData = require('../../models/creatures/edit/defaults').getData;
const backgrounds = require('../../models/creatures/edit/backgrounds');
const expertises = require('../../models/creatures/edit/expertises');
const gifts = require('../../models/creatures/edit/gifts');
const imperfections = require('../../models/creatures/edit/imperfections');
const manifestations = require('../../models/creatures/edit/manifestations');
const milestones = require('../../models/creatures/edit/milestones');
const skills = require('../../models/creatures/edit/skills');

module.exports = (router) => {
    router.get('/', async (req, res, next) => {
        try {
            let result = {
                user: await generic.user(req),
                model: await model.list(req)
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            let result = {
                user: await generic.user(req),
                model: await model.id(req, req.params.id)
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    // Getting lists to edit the Character

    // Epoch

    //todo armour

    //todo asset

    //todo bionic
    //todo augmentation

    //todo corporation

    //todo shield

    //todo weapon

    // World

    //todo country

    //todo identity

    //todo nature

    router.get('/:id/edit/backgrounds', async (req, res, next) => {
        try {
            let [creature, data] = await backgrounds(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                backgrounds: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/expertises', async (req, res, next) => {
        try {
            let [creature, data] = await expertises(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                expertises: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/gifts', async (req, res, next) => {
        try {
            let [creature, data] = await gifts(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                gifts: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/imperfections', async (req, res, next) => {
        try {
            let [creature, data] = await imperfections(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                imperfections: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/manifestations', async (req, res, next) => {
        try {
            let [creature, data] = await manifestations(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                manifestations: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/milestones', async (req, res, next) => {
        try {
            let [creature, data] = await milestones(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                milestones: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/skills', async (req, res, next) => {
        try {
            let [creature, data] = await skills(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                skills: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/software', async (req, res, next) => {
        try {
            let [creature, data] = await getData(req, req.params.id, 'epoch', 'software');

            let result = {
                user: await generic.user(req),
                creature: creature,
                software: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/wealth', async (req, res, next) => {
        try {
            let [creature, data] = await getData(req, req.params.id, 'epoch', 'wealth');

            let result = {
                user: await generic.user(req),
                creature: creature,
                wealth: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });
};