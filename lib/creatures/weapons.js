'use strict';

const request = require('../request');
const utilities = require('../utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getFromAugmentations(req, model) {
    try {
        let data = [];

        for (let i in model.bionics) {
            let augmentations = model.bionics[i].augmentations;

            for (let j in augmentations) {
                let id = augmentations[j].id;
                let results = await request.multiple(req, '/weapons/augmentation/' + id);

                for (let k in results) {
                    results[k].equipped = true;
                    results[k].custom = null;
                    results[k].special = true;

                    data.push(results[k]);
                }
            }
        }

        return data;
    } catch(e) { return e; }
}

async function getFromManifestations(req, model) {
    try {
        let data = [];

        if (model.manifestations !== null) {
            for (let i in model.manifestations) {
                let id = model.manifestations[i].id;
                let results = await request.multiple(req, '/weapons/manifestation/' + id);

                for (let k in results) {
                    results[k].equipped = true;
                    results[k].custom = null;
                    results[k].special = true;

                    data.push(results[k]);
                }
            }
        }

        return data;
    } catch(e) { return e; }
}

async function getFromSpecies(req, model) {
    try {
        let data = [];

        if (model.species !== null) {
            let results = await request.multiple(req, '/weapons/species/' + model.species.id);

            for (let k in results) {
                results[k].equipped = true;
                results[k].custom = null;
                results[k].special = true;

                data.push(results[k]);
            }
        }

        return data;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getDetailsFromBasic(req, basicList) {
    try {
        let data = [];

        for (let i in basicList) {
            let id = basicList[i].id;
            let result = await request.single(req, '/weapons/' + id);

            result.equipped = basicList[i].equipped;
            result.custom = basicList[i].custom;
            result.special = false;

            data.push(result);
        }

        return data;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function get(req, id, model) {
    try {
        let array = [];

        let creatureList = await request.multiple(req, '/creatures/' + id + '/weapons');
        let augmentationList = await getFromAugmentations(req, model);
        let speciesList = await getFromSpecies(req, model);
        let manifestationList = await getFromManifestations(req, model);

        array = utilities.addUniqueItemsToArray(array, speciesList);
        array = utilities.addUniqueItemsToArray(array, manifestationList);
        array = utilities.addUniqueItemsToArray(array, augmentationList);
        array = utilities.addUniqueItemsToArray(array, creatureList);

        let data = await getDetailsFromBasic(req, array);

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            // Generic
            item.attributes = await request.multiple(req, '/weapons/' + item.id + '/attributes');
            item.primals = await request.multiple(req, '/weapons/' + item.id + '/primals');
            item.skills = await request.multiple(req, '/weapons/' + item.id + '/skills');

            // Creature Specific
            item.mods = await request.multiple(req, '/creatures/' + id + '/weapons/' + item.id + '/mods');

            let mods = data[i].mods;

            mods = utilities.splitUnderscoreInArray(mods);
            mods = utilities.sortArrayOnProperty(mods, 'name');
        }

        return data;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.get = get;