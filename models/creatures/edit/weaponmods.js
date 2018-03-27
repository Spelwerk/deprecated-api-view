'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);

    let data = [];

    for (let i in creature.weapons) {
        if (creature.weapons[i].special) continue;

        const id = creature.weapons[i].id;
        const name = creature.weapons[i].name;
        const mods = creature.weapons[i].mods;

        let results = await request.multiple(req, '/weapons/' + id + '/weaponmods');

        if (results.length === 0) continue;

        results = utilities.pruneArrayFromExistingIds(results, mods);

        if (results.length === 0) continue;

        results = utilities.splitUnderscoreInArray(results);
        results = utilities.sortArrayOnProperty(results, 'name');

        data.push({id: id, name: name, results: results});
    }

    return [creature, data];
};