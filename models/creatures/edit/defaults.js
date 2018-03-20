'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function getDefaultData(req, creature, from, relation) {
    const plural = await request.get(req, '/system/config/plural');
    const route = '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation];

    return await request.multiple(req, route + '/default');
}

async function getDataFromRelation(req, creature, fromBase, fromRelation, dataRelation) {
    const plural = await request.get(req, '/system/config/plural');
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
        data = await request.multiple(req, route + '/species/' + creature.species.id);
    }

    return data;
}

async function getData(req, id, from, relation) {
    const plural = await request.get(req, '/system/config/plural');
    const creature = await creatures.id(req, id);

    let data = await request.multiple(req, '/' + plural[from] + '/' + creature[from].id + '/' + plural[relation]);

    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.getDefaultData = getDefaultData;
module.exports.getDataFromRelation = getDataFromRelation;
module.exports.getData = getData;