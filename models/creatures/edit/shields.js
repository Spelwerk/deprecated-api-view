'use strict';

const request = require('../../../lib/request');
const creatures = require('../creatures');
const utilities = require('../../../lib/utilities');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = async (req, id) => {
    const creature = await creatures.id(req, id);
    const route = 'shields';

    let data = await request.multiple(req, '/epochs/' + creature.epoch.id + '/' + route);

    if (data.length > 0) {
        data = utilities.pruneArrayFromExistingIds(data, creature[route]);
        data = utilities.splitUnderscoreInArray(data);
        data = utilities.sortArrayOnProperty(data, 'name');

        for (let n in data) {
            let item = data[n];

            item.attributes = await request.multiple(req, '/' + route + '/' + item.id + '/attributes');
            item.skills = await request.multiple(req, '/' + route + '/' + item.id + '/skills');
            item.primals = await request.multiple(req, '/' + route + '/' + item.id + '/primals');
        }
    }

    return [creature, data];
};