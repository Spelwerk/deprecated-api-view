'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const defaults = require('./defaults');
const utilities = require('../../../lib/utilities');
const plural = require('../../../app/initializers/config').get('plural');

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

    let data = await getData(req, creature);

    const manifestationData = await defaults.getDataFilteredManifestation(req, creature, from, relation);
    const speciesData = await defaults.getDataFilteredSpecies(req, creature, from, relation);

    data = utilities.mergeArraysOnUniqueId(data, manifestationData);
    data = utilities.mergeArraysOnUniqueId(data, speciesData);

    data = utilities.pruneArrayFromExistingIds(data, creature[plural[relation]]);
    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
};