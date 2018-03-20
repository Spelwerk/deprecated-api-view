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
    const relation = 'milestone';
    const array = creature.milestones;

    let data = await defaults.getDefaultData(req, creature, from, relation);

    const backgroundData = await defaults.getDataFromRelation(req, creature, from, relation, 'background');
    const manifestationData = await defaults.getDataFromRelation(req, creature, from, relation, 'manifestation');
    const speciesData = await defaults.getDataFromRelation(req, creature, from, relation, 'species');

    data = utilities.mergeArraysOnUniqueId(data, backgroundData);
    data = utilities.mergeArraysOnUniqueId(data, manifestationData);
    data = utilities.mergeArraysOnUniqueId(data, speciesData);

    data = utilities.pruneArrayFromExistingIds(data, array);
    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return [creature, data];
};