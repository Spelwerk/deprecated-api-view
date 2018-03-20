'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const defaults = require('./defaults');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getData(req, creature) {
    let data = await request.multiple(req, '/epochs/' + creature.epoch.id + '/skills');

    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const from = 'epoch';
    const relation = 'skill';
    const array = creature.skills;

    let data = await getData(req, creature);
    const manifestationResults = await defaults.getDataFromRelation(req, creature, from, relation, 'manifestation');
    const speciesResults = await defaults.getDataFromRelation(req, creature, from, relation, 'species');

    data = utilities.mergeArraysOnUniqueId(data, manifestationResults);
    data = utilities.mergeArraysOnUniqueId(data, speciesResults);

    data = utilities.pruneArrayFromExistingIds(data, array);
    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
};