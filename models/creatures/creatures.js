'use strict';

const request = require('../../lib/request');
const generic = require('../generic');
const utilities = require('../../lib/utilities');
const weapons = require('../../lib/creatures/weapons');
const config = require('../../app/initializers/config');
const getSchema = require('../../app/initializers/schema').get;

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getList(req, id, listRoute) {
    let data = await request.multiple(req, '/creatures/' + id + '/' + listRoute);

    if (data.length > 0) {
        const hasMany = getSchema(config.singular(listRoute)).tables.hasMany;

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

        data = utilities.sortArrayOnProperty(data, 'name');
    }

    return data;
}

async function getSpecies(req, id) {
    let data = await request.single(req, '/creatures/' + id + '/species');

    if (data !== null) {
        data = utilities.splitUnderscoreInItem(data);

        data.attributes = await request.multiple(req, '/species/' + data.id + '/attributes');
    }

    return data;
}

async function getBionics(req, id) {
    let data = await request.multiple(req, '/creatures/' + id + '/bionics');

    if (data.length > 0) {
        for (let i in data) {
            let bionic = data[i];

            bionic = utilities.splitUnderscoreInItem(bionic);

            // Generic
            bionic.attributes = await request.multiple(req, '/bionics/' + bionic.id + '/attributes');
            bionic.skills = await request.multiple(req, '/bionics/' + bionic.id + '/skills');

            // Creature Specific
            bionic.augmentations = await request.multiple(req, '/creatures/' + id + '/bionics/' + bionic.id + '/augmentations');

            let augmentations = bionic.augmentations;

            for (let n in augmentations) {
                let aug = augmentations[n];

                aug = utilities.splitUnderscoreInItem(aug);

                aug.attributes = await request.multiple(req, '/augmentations/' + aug.id + '/attributes');
                aug.skills = await request.multiple(req, '/augmentations/' + aug.id + '/skills');
            }
        }

        data = utilities.sortArrayOnProperty(data, 'name');
    }

    return data;
}

async function getRelations(req, id) {
    let data = await request.multiple(req, '/creatures/' + id + '/relations');

    data = utilities.splitUnderscoreInArray(data);
    data = utilities.sortArrayOnProperty(data, 'name');

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function calculatePoints(req, model) {
    let configuration = config.get('points');
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
    Checking if creature has species and multiplying points
     */

    let speciesMultiplier = 1;

    if(model.exists.species) {
        speciesMultiplier = utilities.floor(model.species.multiply.points, 1);
    }

    /*
    Checking if creature has enough of these
    positive value means we want to add that many to creature
     */

    let milestone = configuration.baseline.milestone + utilities.minMax(age / configuration.divide.milestone, 1, configuration.maximum.milestone);

    model.missing = {
        gift: configuration.baseline.gift - model.gifts.length,
        imperfection: configuration.baseline.imperfection - model.imperfections.length,
        background: configuration.baseline.background - model.backgrounds.length,
        milestone: milestone - model.milestones.length,
    };

    /*
    Setting Points
     */

    let points = {
        skill: configuration.baseline.skill * speciesMultiplier,
        expertise: configuration.baseline.expertise * speciesMultiplier,
        primal: configuration.baseline.primal * speciesMultiplier,
        spell: configuration.baseline.spell * speciesMultiplier,

        language: configuration.baseline.language * configuration.cost.language,
        form: configuration.baseline.form * configuration.cost.form,
    };

    points.expertise = utilities.minMax(points.expertise + (age / configuration.divide.expertise), 1, configuration.maximum.expertise);
    points.primal = utilities.minMax(points.primal + (age / configuration.divide.primal), 1, configuration.maximum.primal);
    points.skill = utilities.minMax(points.skill + (age / configuration.divide.skill), 1, configuration.maximum.skill);
    points.spell = utilities.minMax(points.spell + (age / configuration.divide.spell), 1, configuration.maximum.spell);

    model.points = {
        skill: points.skill,
        expertise: points.expertise,
        primal: points.primal,
        spell: points.spell,

        language: points.language - (model.languages.length * configuration.cost.language),
        form: points.form - (model.forms.length * configuration.cost.form),
    };

    // Expertise Additive calculation
    for (let i in model.expertises) {
        let value = model.expertises[i].value.original;

        for (let n = value; n > 0; n--) {
            model.points.expertise -= n;
        }
    }

    // Primal Additive calculation
    for (let i in model.primals) {
        let value = model.primals[i].value.original;

        for (let n = value; n > 0; n--) {
            model.points.primal -= n;
        }
    }

    // Skill Additive calculation
    for (let i in model.skills) {
        let value = model.skills[i].value.original;

        for (let n = value; n > 0; n--) {
            model.points.skill -= n;
        }
    }

    // Spell calculation
    for (let i in model.spells) {
        model.points.spell -= model.spells[i].cost;
    }

    return model;
}

async function calculateExperience(req, model) {
    let id = config.get('attributes').experience;

    let key;
    for (let i in model.attributes) {
        if (model.attributes[i].id !== id) continue;
        key = i;
    }

    for (let i in model.points) {
        if (model.points[i] > 0) continue;

        model.attributes[key].value.modified += model.points[i];
    }

    return model;
}

async function calculateWounds(req, model) {
    let wounds = config.get('attributes').wounds;

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

            model.attributes[key].value.modified -= list[k].value;
        }
    }

    return model;
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
        model.attributes[i].value.modified = typeof model.attributes[i].value.modified !== 'undefined'
            ? model.attributes[i].value.modified
            : model.attributes[i].value.original;

        let id = model.attributes[i].id;

        /*
        Loop through all attributes in species
         */

        if (model.species !== null) {
            for (let i in model.species.attributes) {
                for (let o in model.species.attributes) {
                    let attribute = model.species.attributes[o];

                    if (id === attribute.id) {
                        model.attributes[i].value.modified += attribute.value;
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
                        model.attributes[i].value.modified += attribute.value;
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
                        model.attributes[i].value.modified += attribute.value;
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
        model.skills[i].value.modified = model.skills[i].value.original;

        let id = model.skills[i].id;

        for (let k in array) {
            let relation = model[array[k]];

            for (let n in relation) {
                if (equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let skills = relation[n].skills;

                for (let o in skills) {
                    let skill = skills[o];

                    if (id === skill.id) {
                        model.skills[i].value.modified += skill.value;
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
                        model.skills[i].value.modified += skill.value;
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
        model.primals[i].value.modified = model.primals[i].value.original;

        let id = model.primals[i].id;

        for (let k in array) {
            let relation = model[array[k]];

            for (let n in relation) {
                if (equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let primals = relation[n].primals;

                for (let o in primals) {
                    let primal = primals[o];

                    if (id === primal.id) {
                        model.primals[i].value.modified += primal.value;
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

        types = utilities.sortArrayOnProperty(types, "name");

        let object = {};

        for (let i in types) {
            let id = types[i].id;
            let name = types[i].name;
            let key = name.toLowerCase();
            let array = [];

            for (let x in model.attributes) {
                let attribute = model.attributes[x];
                if (!attribute.type || attribute.type.id !== id) continue;

                array.push(attribute);
                delete attribute.type;
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
        // Default
        main: await request.single(req, route),

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

        // Biography
        gifts: await getList(req, id, 'gifts'),
        imperfections: await getList(req, id, 'imperfections'),
        backgrounds: await getList(req, id, 'backgrounds'),
        milestones: await getList(req, id, 'milestones'),
        languages: await getList(req, id, 'languages'),
        currencies: await getList(req, id, 'currencies'),

        // Magic
        manifestations: await getList(req, id, 'manifestations'),
        primals: await getList(req, id, 'primals'),
        spells: await getList(req, id, 'spells'),
        forms: await getList(req, id, 'forms'),

        // Bionics, Augmentations & Software
        bionics: await getBionics(req, id),
        software: await getList(req, id, 'software'),

        // Assets & Weapons
        assets: await getList(req, id, 'assets'),
        armours: await getList(req, id, 'armours'),
        shields: await getList(req, id, 'shields'),
        weapons: [],

        // Relations
        loyalties: await getList(req, id, 'loyalties'),
        //relations: await getRelations(req, id),

        // Wounds
        dementations: await request.multiple(req, route + '/dementations'),
        diseases: await request.multiple(req, route + '/diseases'),
        traumas: await request.multiple(req, route + '/traumas'),

        // Creation
        exists: {},
        missing: {},
        points: {},

        // Generic
        permissions: await generic.getPermissions(req, '/creatures', id),
        labels: await generic.getLabels(req, '/creatures', id),
        comments: await generic.getComments(req, '/creatures', id)
    };

    model.main = utilities.splitUnderscoreInItem(model.main);

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
