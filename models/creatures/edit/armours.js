'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const route = 'armours';

    let bodyparts = await request.multiple(req, "/bodyparts");
    //bodyparts = utilities.sortArrayOnProperty(bodyparts, 'order');

    let data = [];

    for (let i in bodyparts) {
        const id = bodyparts[i].id;
        const name = bodyparts[i].name;

        let results = await request.multiple(req, '/epochs/' + creature.epoch.id + '/' + route + '/bodypart/' + id);

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