'use strict';

const generic = require('../../models/generic');
const model = require('../../models/creatures/creatures');
const defaults = require('../../models/creatures/edit/defaults');

const armours = require('../../models/creatures/edit/armours');
const assets = require('../../models/creatures/edit/assets');
const augmentations = require('../../models/creatures/edit/augmentations');
const backgrounds = require('../../models/creatures/edit/backgrounds');
const bionics = require('../../models/creatures/edit/bionics');
const expertises = require('../../models/creatures/edit/expertises');
const gifts = require('../../models/creatures/edit/gifts');
const imperfections = require('../../models/creatures/edit/imperfections');
const manifestations = require('../../models/creatures/edit/manifestations');
const milestones = require('../../models/creatures/edit/milestones');
const skills = require('../../models/creatures/edit/skills');
const shields = require('../../models/creatures/edit/shields');
const weapons = require('../../models/creatures/edit/weapons');

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

    //todo augmentation from bionics on creature
    //todo weaponmods from weapons on creature

    router.get('/:id/edit/armours', async (req, res, next) => {
        try {
            let [creature, data] = await armours(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                armours: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/assets', async (req, res, next) => {
        try {
            let [creature, data] = await assets(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                assets: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/augmentations', async (req, res, next) => {
        try {
            let [creature, data] = await augmentations(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                augmentations: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

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

    router.get('/:id/edit/bionics', async (req, res, next) => {
        try {
            let [creature, data] = await bionics(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                bionics: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/corporation', async (req, res, next) => {
        try {
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'corporation');

            let result = {
                user: await generic.user(req),
                creature: creature,
                corporations: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/country', async (req, res, next) => {
        try {
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'country');

            let result = {
                user: await generic.user(req),
                creature: creature,
                countries: data
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

    router.get('/:id/edit/identity', async (req, res, next) => {
        try {
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'identity');

            let result = {
                user: await generic.user(req),
                creature: creature,
                identities: data
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

    router.get('/:id/edit/nature', async (req, res, next) => {
        try {
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'nature');

            let result = {
                user: await generic.user(req),
                creature: creature,
                natures: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/shields', async (req, res, next) => {
        try {
            let [creature, data] = await shields(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                shields: data
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
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'software');

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
            let [creature, data] = await defaults.getData(req, req.params.id, 'epoch', 'wealth');

            let result = {
                user: await generic.user(req),
                creature: creature,
                wealth: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });

    router.get('/:id/edit/weapons', async (req, res, next) => {
        try {
            let [creature, data] = await weapons(req, req.params.id);

            let result = {
                user: await generic.user(req),
                creature: creature,
                weapons: data
            };

            res.status(200).send(result);
        } catch(e) { next(e); }
    });
};