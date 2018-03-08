'use strict';

const request = require('../lib/request');
const utilities = require('../lib/utilities');
const weapons = require('../lib/creatures/weapons');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getPermissions(req, id) {
    try {
        let data = await request.get(req, '/creatures/' + id + '/permissions');

        if (!data) return null;

        return data;
    } catch(e) { return null; }
}

async function getList(req, id, listRoute) {
    try {
        let data = await request.multiple(req, '/creatures/' + id + '/' + listRoute);

        if (data.length > 0) {
            const schema = await request.get(req, '/' + listRoute + '/schema');
            const hasMany = schema.tables.hasMany;

            for (let i in data) {
                let item = data[i];

                item = utilities.splitUnderscoreInItem(item);

                if (hasMany.indexOf('attribute') !== -1) {
                    item.attributes = await request.multiple(req, '/' + listRoute + '/' + item.id + '/attributes');
                }

                if (hasMany.indexOf('skill') !== -1) {
                    item.skills = await request.multiple(req, '/' + listRoute + '/' + item.id + '/skills');
                }

                if (hasMany.indexOf('primal') !== -1) {
                    item.primals = await request.multiple(req, '/' + listRoute + '/' + item.id + '/primals');
                }
            }

            utilities.sortArrayOnProperty(data, 'name');
        }

        return data;
    } catch(e) { return e; }
}

async function getSpecies(req, id) {
    try {
        let data = await request.single(req, '/creatures/' + id + '/species');

        if (data !== null) {
            data = utilities.splitUnderscoreInItem(data);

            data.attributes = await request.multiple(req, '/gifts/' + data.id + '/attributes');
        }

        return data;
    } catch(e) { return e; }
}

async function getBionics(req, id) {
    try {
        let data = await request.multiple(req, '/creatures/' + id + '/bionics');

        if (data.length > 0) {
            for (let i in data) {
                let item = data[i];

                item = utilities.splitUnderscoreInItem(item);

                item.attributes = await request.multiple(req, '/bionics/' + item.id + '/attributes');
                item.skills = await request.multiple(req, '/bionics/' + item.id + '/skills');
                item.augmentations = await request.multiple(req, '/bionics/' + item.id + '/augmentations');

                for (let n in item.augmentations) {
                    let aug = item.augmentations[n];

                    aug = utilities.splitUnderscoreInItem(aug);

                    aug.attributes = await request.multiple(req, '/bionics/' + aug.id + '/attributes');
                    aug.skills = await request.multiple(req, '/bionics/' + aug.id + '/skills');
                }
            }

            utilities.sortArrayOnProperty(data, 'name');
        }

        return data;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function calculatePoints(req, model) {
    try {
        let config = await request.get(req, '/system/config/points');
        let age = model.main.age;

        /*
        Setting Simple (boolean) points "exists"
        If the value is false, we want to let player add it
         */

        model.exists = {
            identity: !!model.identity,
            nature: !!model.nature,
            wealth: !!model.wealth,
            country: !!model.country,
            corporation: !!model.corporation,
            species: !!model.species,
        };

        /*
        Checking if creature has enough of these
        positive value means we want to add that many to creature
         */

        let milestone = config.baseline.milestone + utilities.minMax(age / config.divide.milestone, 1, config.maximum.milestone);

        model.missing = {
            gift: config.baseline.gift - model.gifts.length,
            imperfection: config.baseline.imperfection - model.imperfections.length,
            background: config.baseline.background - model.backgrounds.length,
            milestone: milestone - model.milestones.length,
        };

        /*
        Setting Points
         */

        let points = {
            skill: config.baseline.skill,
            expertise: config.baseline.expertise,
            primal: config.baseline.primal,
            spell: config.baseline.spell,

            language: config.baseline.language * config.cost.language,
            form: config.baseline.form * config.cost.form,
        };

        points.expertise += utilities.minMax(age / config.divide.expertise, 1, config.maximum.expertise);
        points.primal += utilities.minMax(age / config.divide.primal, 1, config.maximum.primal);
        points.skill += utilities.minMax(age / config.divide.skill, 1, config.maximum.skill);
        points.spell += utilities.minMax(age / config.divide.spell, 1, config.maximum.spell);

        model.points = {
            skill: points.skill,
            expertise: points.expertise,
            primal: points.primal,
            spell: points.spell,

            language: points.language - (model.languages.length * config.cost.language),
            form: points.form - (model.forms.length * config.cost.form),
        };

        // Expertise Additive calculation
        for (let i in model.expertises) {
            let value = model.expertises[i].value;

            for (let n = value; n > 0; n--) {
                model.points.expertise -= n;
            }
        }

        // Primal Additive calculation
        for (let i in model.primals) {
            let value = model.primals[i].value;

            for (let n = value; n > 0; n--) {
                model.points.primal -= n;
            }
        }

        // Skill Additive calculation
        for (let i in model.skills) {
            let value = model.skills[i].value;

            for (let n = value; n > 0; n--) {
                model.points.skill -= n;
            }
        }

        // Spell calculation
        for (let i in model.spells) {
            model.points.spell -= model.spells[i].cost;
        }

        return model;
    } catch(e) {
        return e;
    }
}

async function calculateExperience(req, model) {
    try {
        let config = await request.get(req, '/system/config/attributes');
        let id = config.experience;

        let key;
        for (let i in model.attributes) {
            if (model.attributes[i].id !== id) continue;
            key = i;
        }

        for (let i in model.points) {
            if (model.points[i] > 0) continue;

            model.attributes[key].value += model.points[i];
        }

        return model;
    } catch(e) { return e; }
}

async function calculateWounds(req, model) {
    try {
        let config = await request.get(req, '/system/config/attributes');
        let wounds = config.wounds;

        for (let i in wounds) {
            let id = wounds[i];

            let key;
            for (let i in model.attributes) {
                if (model.attributes[i].id !== id) continue;
                key = i;
            }

            let list = model[i];

            for (let k in list) {
                if (list[k].healed) continue;

                model.attributes[key].value -= list[k].value;
            }
        }

        return model;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

function addAttributes(model) {
    const array = [
        'gifts',
        'imperfections',
        'backgrounds',
        'milestones',
        'manifestations',
        'bionics',
        'assets',
        'armours',
        'shields',
        'weapons'
    ];

    const equipable = [
        'assets',
        'armours',
        'shields',
        'weapons'
    ];

    /*
    For each attribute in creature list,
     */

    for (let i in model.attributes) {
        let id = model.attributes[i].id;

        /*
        Loop through all attributes in species
         */

        if (model.species !== null) {
            for (let u in model.species.attributes) {
                for (let o in model.species.attributes) {
                    let attribute = model.species.attributes[o];

                    if (id === attribute.id) {
                        model.attributes[u].value += attribute.value;
                    }
                }
            }
        }

        /*
        Loop through each of the relations in array,
        then loop through all objects connected to that relation,
        then loop through all attributes connected to that object,
        then compare creature attribute with the object attribute and add values where appropriate
         */

        for (let k in array) {
            let relation = model[array[k]];

            for (let n in relation) {
                if (equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let attributes = relation[n].attributes;

                for (let o in attributes) {
                    let attribute = attributes[o];

                    if (id === attribute.id) {
                        model.attributes[i].value += attribute.value;
                    }
                }
            }
        }

        /*
        Loop through all bionics,
        then loop through all augmentations equipped to that bionic,
        then loop through all attributes connected to that augmentation,
        then compare creature attribute with the augmentation attribute and add values where appropriate
         */

        for (let x in model.bionics) {
            let augmentations = model.bionics[x].augmentations;

            for (let z in augmentations) {
                let attributes = augmentations[z].attributes;

                for (let a in attributes) {
                    let attribute = attributes[a];

                    if (id === attribute.id) {
                        model.attributes[i].value += attribute.value;
                    }
                }
            }
        }
    }

    return model;
}

function addSkills(model) {
    const array = [
        'gifts',
        'imperfections',
        'backgrounds',
        'milestones',
        'bionics',
    ];

    const equipable = [
        'assets',
        'armours',
        'shields',
        'weapons'
    ];

    /*
    For each skill in creature list,
    loop through each of the relations in array,
    then loop through all objects connected to that relation,
    then loop through all skills connected to that object,
    then compare creature skill with the object skill and add values where appropriate
     */

    for (let i in model.skills) {
        let id = model.skills[i].id;

        for (let k in array) {
            let relation = model[array[k]];

            for (let n in relation) {
                if (equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let skills = relation[n].skills;

                for (let o in skills) {
                    let skill = skills[o];

                    if (id === skill.id) {
                        model.skills[i].value += skill.value;
                    }
                }
            }
        }

        /*
        Loop through all bionics,
        then loop through all augmentations equipped to that bionic,
        then loop through all skills connected to that augmentation,
        then compare creature skill with the augmentation skill and add values where appropriate
         */

        for (let x in model.bionics) {
            let augmentations = model.bionics[x].augmentations;

            for (let z in augmentations) {
                let skills = augmentations[z].skills;

                for (let a in skills) {
                    let skill = skills[a];

                    if (id === skill.id) {
                        model.skills[i].value += skill.value;
                    }
                }
            }
        }
    }

    return model;
}

function addPrimals(model) {
    const array = [
        'backgrounds',
        'milestones'
    ];

    const equipable = [
        'assets',
        'armours',
        'shields',
        'weapons'
    ];

    /*
    For each primal in creature list,
    loop through each of the relations in array,
    then loop through all objects connected to that relation,
    then loop through all primals connected to that object,
    then compare creature primal with the object primal and add values where appropriate
     */

    for (let i in model.primals) {
        let id = model.primals[i].id;

        for (let k in array) {
            let relation = model[array[k]];

            for (let n in relation) {
                if (equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let primals = relation[n].primals;

                for (let o in primals) {
                    let primal = primals[o];

                    if (id === primal.id) {
                        model.primals[i].value += primal.value;
                    }
                }
            }
        }
    }

    return model;
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function sortAttributes(req, model) {
    try {
        let data = await request.get(req, '/attributetypes');
        let types = data.results;

        utilities.sortArrayOnProperty(types, "name");

        let object = {};

        for (let i in types) {
            let id = types[i].id;
            let name = types[i].name;
            let key = name.toLowerCase();
            let array = [];

            for (let x in model.attributes) {
                if (model.attributes[x].type.id !== id) continue;

                array.push(model.attributes[x]);
            }

            if (array.length > 0) {
                object[key] = { title: name, list: array };
            }
        }

        return object;
    } catch(e) { return e; }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function list(req) {
    return await request.get(req, '/creatures');
}

async function id(req, id) {
    const route = '/creatures/' + id;

    let model = {
        main: await request.single(req, route),

        // Permission
        permissions: await getPermissions(req, id),

        // Defining
        identity: await request.single(req, route + '/identity'),
        nature: await request.single(req, route + '/nature'),
        species: await getSpecies(req, id),
        wealth: await request.single(req, route + '/wealth'),

        // Single
        world: await request.single(req, route + '/world'),
        epoch: await request.single(req, route + '/epoch'),
        country: await request.single(req, route + '/country'),
        corporation: await request.single(req, route + '/corporation'),

        // Arrays
        attributes: await getList(req, id, 'attributes'),
        skills: await getList(req, id, 'skills'),
        expertises: await getList(req, id, 'expertises'),

        gifts: await getList(req, id, 'gifts'),
        imperfections: await getList(req, id, 'imperfections'),
        backgrounds: await getList(req, id, 'backgrounds'),
        milestones: await getList(req, id, 'milestones'),
        languages: await getList(req, id, 'languages'),
        currencies: await getList(req, id, 'currencies'),

        manifestations: await getList(req, id, 'manifestations'),
        primals: await getList(req, id, 'primals'),
        spells: await getList(req, id, 'spells'),
        forms: await getList(req, id, 'forms'),

        bionics: await getBionics(req, id),
        software: await getList(req, id, 'software'),

        assets: await getList(req, id, 'assets'),
        armours: await getList(req, id, 'armours'),
        shields: await getList(req, id, 'shields'),

        weapons: [],

        loyalties: await getList(req, id, '/loyalties'),
        relations: await getList(req, id, '/relations'),

        dementations: await request.multiple(req, route + '/dementations'),
        diseases: await request.multiple(req, route + '/diseases'),
        traumas: await request.multiple(req, route + '/traumas'),

        exists: {},
        missing: {},
        points: {},

        labels: await request.multiple(req, route + '/labels'),
        comments: await request.multiple(req, route + '/comments')
    };

    model = await calculatePoints(req, model);
    model = await calculateExperience(req, model);
    model = await calculateWounds(req, model);

    model.weapons = await weapons.get(req, id, model);

    model = addAttributes(model);
    model = addSkills(model);
    model = addPrimals(model);

    model.attributes = await sortAttributes(req, model);

    return model;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.list = list;
module.exports.id = id;
