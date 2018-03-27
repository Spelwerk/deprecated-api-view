'use strict';

const creatures = require('../creatures');
const defaults = require('./defaults');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const from = 'epoch';
    const relation = 'manifestation';
    const array = creature.imperfections;

    let data = await defaults.getDataFromDefault(req, creature, from, relation);

    const speciesData = await defaults.getDataFilteredSpecies(req, creature, from, relation);

    data = utilities.mergeArraysOnUniqueId(data, speciesData);

    data = utilities.pruneArrayFromExistingIds(data, array);
    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
};