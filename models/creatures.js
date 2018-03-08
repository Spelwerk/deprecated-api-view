'use strict';

const request = require('../lib/request');
const utilities = require('../lib/utilities');
const weapons = require('../lib/creatures/weapons');

const root = '/creatures';

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getPermissions(req, route) {
    try {
        let data = await request.get(req, route + '/permissions');

        if (!data) return null;

        return data;
    } catch(e) { return null; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getAttributes(req, route) {
    try {
        let data = await request.multiple(req, route + '/attributes');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);
        }

        return data;
    } catch(e) { return []; }
}

async function getExpertises(req, route) {
    try {
        let data = await request.multiple(req, route + '/expertises');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);
        }

        return data;
    } catch(e) { return e; }
}

async function getSpecies(req, route) {
    try {
        let data = await request.single(req, route + '/species');

        if (data !== null) {
            data = utilities.splitUnderscoreInItem(data);

            data.attributes = await request.multiple(req, route + '/gifts/' + data.id + '/attributes/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getGifts(req, route) {
    try {
        let data = await request.multiple(req, route + '/gifts');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/gifts/' + item.id + '/attributes/mini');
            item.attributes = await request.multiple(req, route + '/gifts/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getImperfections(req, route) {
    try {
        let data = await request.multiple(req, route + '/imperfections');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/imperfections/' + item.id + '/attributes/mini');
            item.attributes = await request.multiple(req, route + '/imperfections/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getBackgrounds(req, route) {
    try {
        let data = await request.multiple(req, route + '/backgrounds');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/backgrounds/' + item.id + '/attributes/mini');
            item.attributes = await request.multiple(req, route + '/backgrounds/' + item.id + '/primals/mini');
            item.attributes = await request.multiple(req, route + '/backgrounds/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getMilestones(req, route) {
    try {
        let data = await request.multiple(req, route + '/milestones');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/milestones/' + item.id + '/attributes/mini');
            item.attributes = await request.multiple(req, route + '/milestones/' + item.id + '/primals/mini');
            item.attributes = await request.multiple(req, route + '/milestones/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getManifestations(req, route) {
    try {
        let data = await request.multiple(req, route + '/manifestations');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/manifestations/' + item.id + '/attributes/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getSpells(req, route) {
    try {
        let data = await request.multiple(req, route + '/spells');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);
        }

        return data;
    } catch(e) { return e; }
}

async function getBionics(req, route) {
    try {
        let data = await request.multiple(req, route + '/bionics');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/bionics/' + item.id + '/attributes/mini');
            item.skills = await request.multiple(req, route + '/bionics/' + item.id + '/skills/mini');
            item.augmentations = await request.multiple(req, route + '/bionics/' + item.id + '/augmentations/mini');

            for (let n in item.augmentations) {
                let aug = item.augmentations[n];

                aug = utilities.splitUnderscoreInItem(aug);

                aug.attributes = await request.multiple(req, route + '/bionics/' + aug.id + '/attributes/mini');
                aug.skills = await request.multiple(req, route + '/bionics/' + aug.id + '/skills/mini');
            }
        }

        return data;
    } catch(e) { return e; }
}

async function getSoftware(req, route) {
    try {
        let data = await request.multiple(req, route + '/software');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);
        }

        return data;
    } catch(e) { return e; }
}

async function getAssets(req, route) {
    try {
        let data = await request.multiple(req, route + '/assets');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/assets/' + item.id + '/attributes/mini');
            item.primals = await request.multiple(req, route + '/assets/' + item.id + '/primals/mini');
            item.skills = await request.multiple(req, route + '/assets/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getArmours(req, route) {
    try {
        let data = await request.multiple(req, route + '/armours');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, route + '/armours/' + item.id + '/attributes/mini');
            item.primals = await request.multiple(req, route + '/armours/' + item.id + '/primals/mini');
            item.skills = await request.multiple(req, route + '/armours/' + item.id + '/skills/mini');
        }

        return data;
    } catch(e) { return e; }
}

async function getShields(req, route) {
    try {
        let data = await request.multiple(req, route + '/shields');

        for (let i in data) {
            let item = data[i];

            item = utilities.splitUnderscoreInItem(item);

            item.attributes = await request.multiple(req, '/shields/' + item.id + '/attributes/mini');
            item.primals = await request.multiple(req, '/shields/' + item.id + '/primals/mini');
            item.skills = await request.multiple(req, '/shields/' + item.id + '/skills/mini');
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

        let milestone = config.baseline.milestone + utilities.MINMAX(age / config.divide.milestone, 1, config.maximum.milestone);

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

        points.expertise += utilities.MINMAX(age / config.divide.expertise, 1, config.maximum.expertise);
        points.primal += utilities.MINMAX(age / config.divide.primal, 1, config.maximum.primal);
        points.skill += utilities.MINMAX(age / config.divide.skill, 1, config.maximum.skill);
        points.spell += utilities.MINMAX(age / config.divide.spell, 1, config.maximum.spell);

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
    return await request.get(req, root);
}

async function id(req, id) {
    const route = root + '/' + id;

    let model = {
        main: await request.single(req, route),

        // Permission
        permissions: await getPermissions(req, route),

        // Defining
        identity: await request.single(req, route + '/identity'),
        nature: await request.single(req, route + '/nature'),
        species: await getSpecies(req, route),
        wealth: await request.single(req, route + '/wealth'),

        // Single
        world: await request.single(req, route + '/world'),
        epoch: await request.single(req, route + '/epoch'),
        country: await request.single(req, route + '/country'),
        corporation: await request.single(req, route + '/corporation'),

        // Arrays
        attributes: await getAttributes(req, route),
        skills: await request.multiple(req, route + '/skills'),
        expertises: await getExpertises(req, route),

        gifts: await getGifts(req, route),
        imperfections: await getImperfections(req, route),
        backgrounds: await getBackgrounds(req, route),
        milestones: await getMilestones(req, route),
        languages: await request.multiple(req, route + '/languages'),
        currencies: await request.multiple(req, route + '/currencies'),

        manifestations: await getManifestations(req, route),
        primals: await request.multiple(req, route + '/primals'),
        spells: await getSpells(req, route),
        forms: await request.multiple(req, route + '/forms'),

        bionics: await getBionics(req, route),
        software: await getSoftware(req, route),

        assets: await getAssets(req, route),
        armours: await getArmours(req, route),
        shields: await getShields(req, route),

        weapons: [],

        loyalties: await request.multiple(req, route + '/loyalties'),
        relations: await request.multiple(req, route + '/relations'),

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

    model.weapons = await weapons.get(req, route, model);

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
