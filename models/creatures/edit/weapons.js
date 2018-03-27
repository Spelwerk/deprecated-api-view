'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const route = 'weapons';

    let types = await request.multiple(req, "/weapontypes");
    types = utilities.sortArrayOnProperty(types, 'name');

    let data = [];

    for (let i in types) {
        const id = types[i].id;
        const name = types[i].name;

        let results = await request.multiple(req, '/epochs/' + creature.epoch.id + '/' + route + '/type/' + id);

        console.log(results);

        if (results.length === 0) continue;

        results = utilities.pruneArrayFromExistingIds(results, creature[route]);

        if (results.length === 0) continue;

        results = utilities.splitUnderscoreInArray(results);
        results = utilities.sortArrayOnProperty(results, 'name');

        for (let n in results) {
            let item = results[n];

            item.attributes = await request.multiple(req, '/' + route + '/' + item.id + '/attributes');
            item.skills = await request.multiple(req, '/' + route + '/' + item.id + '/skills');
            item.primals = await request.multiple(req, '/' + route + '/' + item.id + '/primals');
        }

        data.push({id: id, name: name, results: results});
    }

    return [creature, data];
};