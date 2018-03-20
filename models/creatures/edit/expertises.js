'use strict';

const request = require('../../../lib/request');
const utilities = require('../../../lib/utilities');
const creatures = require('../creatures');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getDefaultData(req, creature, skillId) {
    return await request.multiple(req, '/epochs/' + creature.epoch.id + '/expertises/skill/' + skillId);
}

async function getManifestationData(req, creature, skillId) {
    const route = '/epochs/' + creature.epoch.id + '/expertises/skill/' + skillId + '/manifestation/';

    let data = [];

    for (let i in creature.manifestations) {
        let results = await request.multiple(req, route + creature.manifestations[i].id);

        for (let n in results) {
            data.push(results[n]);
        }
    }

    return data;
}

async function getSpeciesData(req, creature, skillId) {
    const route = '/epochs/' + creature.epoch.id + '/expertises/skill/' + skillId + '/species/';

    let data = [];

    if (creature.species.id !== null) {
        data = await request.multiple(req, route + creature.species.id);
    }

    return data;
}

async function getSkillData(req, creature, skillId) {
    let data = await getDefaultData(req, creature, skillId);

    const manifestationData = await getManifestationData(req, creature, skillId);
    const speciesData = await getSpeciesData(req, creature, skillId);

    data = utilities.mergeArraysOnUniqueId(data, manifestationData);
    data = utilities.mergeArraysOnUniqueId(data, speciesData);

    return data;
}

function pruneExpertisesWithInsufficientSkillValue(array, value) {
    let data = [];

    for (let i in array) {
        const requirement = array[i].skill.requirement;

        if (value >= requirement) data.push(array[i]);
    }

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);

    let data = [];

    for (let i in creature.skills) {
        const id = creature.skills[i].id;
        const name = creature.skills[i].name;
        const value = creature.skills[i].value.original;

        let results = await getSkillData(req, creature, id);

        results = utilities.pruneArrayFromExistingIds(results, creature.expertises);
        results = utilities.splitUnderscoreInArray(results);
        results = utilities.sortArrayOnProperty(results, 'name');
        results = pruneExpertisesWithInsufficientSkillValue(results, value);

        if(results.length > 0) data.push({id: id, name: name, value: value, expertises: results});
    }

    return [creature, data];
};