'use strict';

const creatures = require('../creatures');
const defaults = require('./defaults');
const utilities = require('../../../lib/utilities');
const plural = require('../../../app/initializers/config').get('plural');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const from = 'epoch';
    const relation = 'gift';

    let data = await defaults.getDataFromDefault(req, creature, from, relation);

    const manifestationData = await defaults.getDataFilteredManifestation(req, creature, from, relation);
    const speciesData = await defaults.getDataFilteredSpecies(req, creature, from, relation);

    data = utilities.mergeArraysOnUniqueId(data, manifestationData);
    data = utilities.mergeArraysOnUniqueId(data, speciesData);

    data = utilities.pruneArrayFromExistingIds(data, creature[plural[relation]]);
    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
};