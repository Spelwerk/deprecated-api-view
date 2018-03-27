'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');
const plural = require('../../../app/initializers/config').get('plural');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function getData(req, id, from, relation) {
    const creature = await creatures.id(req, id);

    let data = await request.multiple(req, '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation]);

    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
}

async function getDataFromDefault(req, creature, from, relation) {
    return await request.multiple(req, '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation] + '/default');
}

async function getDataFromRelation(req, creature, fromBase, fromRelation, dataRelation) {
    const route = '/' + plural[fromBase] + '/' + creature[fromBase].id + '/' + plural[fromRelation];

    let data = [];

    if (Array.isArray(creature[plural[dataRelation]])) {
        const array = creature[plural[dataRelation]];

        for (let i in array) {
            let results = await request.multiple(req, route + '/' + plural[dataRelation] + '/' + array[i].id)

            for (let n in results) {
                data.push(results[n]);
            }
        }
    } else {
        data = await request.multiple(req, route + '/' + dataRelation + '/' + creature.species.id);
    }

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getDataFilteredBackground(req, creature, from, relation) {
    const route = '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation] + '/background/';

    let data = [];

    for (let i in creature.backgrounds) {
        const id = creature.backgrounds[i].id;

        let results = await request.multiple(req, route + id);

        for (let n in results) {
            data.push(results[n]);
        }
    }

    return data;
}

async function getDataFilteredManifestation(req, creature, from, relation) {
    const route = '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation] + '/manifestation/';

    let data = [];

    for (let i in creature.manifestations) {
        const id = creature.manifestations[i].id;

        let results = await request.multiple(req, route + id);

        for (let n in results) {
            data.push(results[n]);
        }
    }

    return data;
}

async function getDataFilteredSpecies(req, creature, from, relation) {
    const route = '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation] + '/species/';

    return await request.multiple(req, route + creature.species.id);
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.getData = getData;
module.exports.getDataFromDefault = getDataFromDefault;
module.exports.getDataFromRelation = getDataFromRelation;

module.exports.getDataFilteredBackground = getDataFilteredBackground;
module.exports.getDataFilteredManifestation = getDataFilteredManifestation;
module.exports.getDataFilteredSpecies = getDataFilteredSpecies;