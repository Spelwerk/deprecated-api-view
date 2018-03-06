'use strict';

const request = require('../lib/request');
const root = '/creatures';

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

function FLOOR(number, floor) {
    number = parseInt(number) || floor;
    number = number < floor
        ? floor
        : number;

    return number;
}

function ROOF(number, roof) {
    number = parseInt(number) || roof;
    number = number > roof
        ? roof
        : number;

    return number;
}

function MINMAX(number, floor, roof) {
    return ROOF(FLOOR(number, floor), roof);
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getValues(req, relation, id, extra) {
    return await request.multiple(req, '/' + relation + '/' + id + '/' + extra + '/value');
}

async function getCreatureWeapons(req, model) {
    try {
        let data = [];

        for(let i in model.weapons) {
            let id = model.weapons[i].id;
            let result = await request.single(req, '/weapons/' + id);

            result.equipped = model.weapons[i].equipped;
            result.custom = model.weapons[i].custom;

            data.push(result);
        }

        return data;
    } catch(e) { return e; }
}

async function getAugmentationWeapons(req, model) {
    try {
        let data = [];

        for(let i in model.bionics) {
            let augmentations = model.bionics[i].augmentations;

            for(let j in augmentations) {
                let id = augmentations[j].id;
                let results = await request.multiple(req, '/weapons/augmentation/' + id);

                for(let k in results) {
                    results[k].equipped = true;
                    results[k].custom = null;

                    data.push(results[k]);
                }
            }
        }

        return data;

    } catch(e) { return e; }
}

async function getManifestationWeapons(req, model) {
    try {
        let data = [];

        for(let i in model.manifestations) {
            let id = model.manifestations[i].id;
            let results = await request.multiple(req, '/weapons/manifestation/' + id);

            for(let k in results) {
                results[k].equipped = true;
                results[k].custom = null;

                data.push(results[k]);
            }
        }

        return data;

    } catch(e) { return e; }
}

async function getSpeciesWeapons(req, model) {
    try {
        let data = [];

        if(model.species !== null) {
            let results = await request.multiple(req, '/weapons/species/' + model.species.id);

            for(let k in results) {
                results[k].equipped = true;
                results[k].custom = null;

                data.push(results[k]);
            }
        }

        return data;
    } catch(e) { return e; }
}

function pushWeaponIntoData(data, array) {
    for(let i in array) {
        let weapon = array[i];
        let alreadyHas = false;

        for(let j in data) {
            if(weapon.id === data[j].id) alreadyHas = true;
        }

        if(!alreadyHas) {
            data.push(weapon);
        }
    }

    return data;
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getPermissions(req, route) {
    try {
        let data = await request.get(req, route + '/permissions');

        if(!data) return null;

        return data;
    } catch(e) { return null; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function getAttributes(req, route) {
    const relation = 'attributes';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Type object instead
            data[i].type = {
                id: data[i].attributetype_id,
                name: data[i].attributetype_name
            };

            // Remove redundant data
            delete data[i].attributetype_id;
            delete data[i].attributetype_name;
        }

        return data;
    } catch(e) { return []; }
}

async function getExpertises(req, route) {
    const relation = 'expertises';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Type object instead
            data[i].skill = {
                id: data[i].skill_id,
                name: data[i].skill_name
            };

            // Remove redundant data
            delete data[i].skill_id;
            delete data[i].skill_name;
        }

        return data;
    } catch(e) { return []; }
}

async function getSpecies(req, route) {
    const relation = 'species';

    try {
        let data = await request.single(req, route + '/' + relation);

        if(data !== null) {
            data.attributes = await getValues(req, relation, data.id, 'attributes');
        }

        return data;
    } catch(e) { return []; }
}

async function getGifts(req, route) {
    const relation = 'gifts';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getImperfections(req, route) {
    const relation = 'imperfections';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getBackgrounds(req, route) {
    const relation = 'backgrounds';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getMilestones(req, route) {
    const relation = 'milestones';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getManifestations(req, route) {
    const relation = 'manifestations';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
        }

        return data;
    } catch(e) { return []; }
}

async function getSpells(req, route) {
    const relation = 'spells';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Effect object instead
            data[i].effects = {
                effect: data[i].effect,
                dice: data[i].effect_dice,
                bonus: data[i].effect_bonus
            };
            delete data[i].effect_dice;
            delete data[i].effect_bonus;

            // Create the Damage object instead
            data[i].damage = {
                id: data[i].attribute_id,
                name: data[i].attribute_name,
                dice: data[i].damage_dice,
                bonus: data[i].damage_bonus
            };
            delete data[i].attribute_id;
            delete data[i].attribute_name;
            delete data[i].damage_dice;
            delete data[i].damage_bonus;

            // Create the Critical object instead
            data[i].critical = {
                dice: data[i].critical_dice,
                bonus: data[i].critical_bonus
            };
            delete data[i].critical_dice;
            delete data[i].critical_bonus;
        }

        return data;
    } catch(e) { return []; }
}

async function getBionics(req, route) {
    const relation = 'bionics';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Hacking object instead
            data[i].hacking = {
                difficulty: data[i].hacking_difficulty,
            };
            delete data[i].hacking_difficulty;

            // Create the BodyPart object instead
            data[i].bodyPart = {
                id: data[i].bodypart_id,
                name: data[i].bodypart_name
            };
            delete data[i].bodypart_id;
            delete data[i].bodypart_name;

            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
            data[i].augmentations = await request.multiple(req, route + '/' + relation + '/' + data[i].id + '/augmentations/names');

            for(let n in data[i].augmentations) {
                let id = data[i].augmentations[n].id;

                data[i].augmentations[n].attributes = await getValues(req, 'augmentations', id, 'attributes');
                data[i].augmentations[n].skills = await getValues(req, 'augmentations', id, 'skills');
            }
        }

        return data;
    } catch(e) { return []; }
}

async function getSoftware(req, route) {
    const relation = 'software';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Hacking object instead
            data[i].hacking = {
                difficulty: data[i].hacking_difficulty,
                bonus: data[i].hacking_bonus,
            };
            delete data[i].hacking_difficulty;
            delete data[i].hacking_bonus;

            // Create the Type object instead
            data[i].type = {
                id: data[i].softwaretype_id,
                name: data[i].softwaretype_name
            };
            delete data[i].softwaretype_id;
            delete data[i].softwaretype_name;
        }

        return data;
    } catch(e) { return []; }
}

async function getAssets(req, route) {
    const relation = 'assets';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Type object instead
            data[i].type = {
                id: data[i].assettype_id,
                name: data[i].assettype_name
            };
            delete data[i].assettype_id;
            delete data[i].assettype_name;

            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getArmours(req, route) {
    const relation = 'armours';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the BodyPart object instead
            data[i].bodyPart = {
                id: data[i].bodypart_id,
                name: data[i].bodypart_name
            };
            delete data[i].bodypart_id;
            delete data[i].bodypart_name;

            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

async function getShields(req, route) {
    const relation = 'shields';

    try {
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            // Create the Damage object instead
            data[i].damage = {
                id: data[i].attribute_id,
                name: data[i].attribute_name,
                dice: data[i].damage_dice,
                bonus: data[i].damage_bonus
            };
            delete data[i].attribute_id;
            delete data[i].attribute_name;
            delete data[i].damage_dice;
            delete data[i].damage_bonus;

            // Create the Critical object instead
            data[i].critical = {
                dice: data[i].critical_dice,
                bonus: data[i].critical_bonus
            };
            delete data[i].critical_dice;
            delete data[i].critical_bonus;

            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
        }

        return data;
    } catch(e) { return []; }
}

// ////////////////////////////////////////////////////////////////////////////////// //

async function fixWeapons(req, route, model) {
    const relation = 'weapons';

    try {
        let data = await getCreatureWeapons(req, model);

        let augmentationWeapons = await getAugmentationWeapons(req, model);
        let manifestationWeapons = await getManifestationWeapons(req, model);
        let speciesWeapons = await getSpeciesWeapons(req, model);

        data = pushWeaponIntoData(data, augmentationWeapons);
        data = pushWeaponIntoData(data, manifestationWeapons);
        data = pushWeaponIntoData(data, speciesWeapons);

        for(let i in data) {
            // Create the Type object instead
            data[i].type = {
                id: data[i].weapontype_id,
                name: data[i].weapontype_name
            };
            delete data[i].weapontype_id;
            delete data[i].weapontype_name;

            // Create the Damage object instead
            data[i].damage = {
                id: data[i].attribute_id,
                name: data[i].attribute_name,
                dice: data[i].damage_dice,
                bonus: data[i].damage_bonus
            };
            delete data[i].attribute_id;
            delete data[i].attribute_name;
            delete data[i].damage_dice;
            delete data[i].damage_bonus;

            // Create the Critical object instead
            data[i].critical = {
                dice: data[i].critical_dice,
                bonus: data[i].critical_bonus
            };
            delete data[i].critical_dice;
            delete data[i].critical_bonus;

            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
            data[i].primals = await getValues(req, relation, data[i].id, 'primals');
            data[i].skills = await getValues(req, relation, data[i].id, 'skills');
            data[i].mods = await request.multiple(req, route + '/' + relation + '/' + data[i].id + '/mods');

            for(let n in data[i].mods) {
                // Create the Damage object instead
                data[i].mods[n].damage = {
                    dice: data[i].mods[n].damage_dice,
                    bonus: data[i].mods[n].damage_bonus
                };
                delete data[i].mods[n].damage_dice;
                delete data[i].mods[n].damage_bonus;

                // Create the Critical object instead
                data[i].mods[n].critical = {
                    dice: data[i].mods[n].critical_dice,
                    bonus: data[i].mods[n].critical_bonus
                };
                delete data[i].mods[n].critical_dice;
                delete data[i].mods[n].critical_bonus;
            }
        }

        return data;
    } catch(e) { return []; }
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
        let milestone = config.baseline.milestone + MINMAX(age / config.divide.milestone, 1, config.maximum.milestone);

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

        points.expertise += MINMAX(age / config.divide.expertise, 1, config.maximum.expertise);
        points.primal += MINMAX(age / config.divide.primal, 1, config.maximum.primal);
        points.skill += MINMAX(age / config.divide.skill, 1, config.maximum.skill);
        points.spell += MINMAX(age / config.divide.spell, 1, config.maximum.spell);

        model.points = {
            skill: points.skill,
            expertise: points.expertise,
            primal: points.primal,
            spell: points.spell,

            language: points.language - (model.languages.length * config.cost.language),
            form: points.form - (model.forms.length * config.cost.form),
        };

        // Expertise Additive calculation
        for(let i in model.expertises) {
            let value = model.expertises[i].value;

            for(let n = value; n > 0; n--) {
                model.points.expertise -= n;
            }
        }

        // Primal Additive calculation
        for(let i in model.primals) {
            let value = model.primals[i].value;

            for(let n = value; n > 0; n--) {
                model.points.primal -= n;
            }
        }

        // Skill Additive calculation
        for(let i in model.skills) {
            let value = model.skills[i].value;

            for(let n = value; n > 0; n--) {
                model.points.skill -= n;
            }
        }

        // Spell calculation
        for(let i in model.spells) {
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
        for(let i in model.attributes) {
            if(model.attributes[i].id !== id) continue;
            key = i;
        }

        for(let i in model.points) {
            if(model.points[i] > 0) continue;

            model.attributes[key].value += model.points[i];
        }

        return model;
    } catch(e) { return e; }
}

async function calculateWounds(req, model) {
    try {
        let config = await request.get(req, '/system/config/attributes');
        let wounds = config.wounds;

        for(let i in wounds) {
            let id = wounds[i];

            let key;
            for(let i in model.attributes) {
                if(model.attributes[i].id !== id) continue;
                key = i;
            }

            let list = model[i];

            for(let k in list) {
                if(list[k].healed) continue;

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

    for(let i in model.attributes) {
        let id = model.attributes[i].id;

        /*
        Loop through all attributes in species
         */

        if(model.species !== null) {
            for(let u in model.species.attributes) {
                for(let o in model.species.attributes) {
                    let attribute = model.species.attributes[o];

                    if(id === attribute.id) {
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

        for(let k in array) {
            let relation = model[array[k]];

            for(let n in relation) {
                if(equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let attributes = relation[n].attributes;

                for(let o in attributes) {
                    let attribute = attributes[o];

                    if(id === attribute.id) {
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

        for(let x in model.bionics) {
            let augmentations = model.bionics[x].augmentations;

            for(let z in augmentations) {
                let attributes = augmentations[z].attributes;

                for(let a in attributes) {
                    let attribute = attributes[a];

                    if(id === attribute.id) {
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

    for(let i in model.skills) {
        let id = model.skills[i].id;

        for(let k in array) {
            let relation = model[array[k]];

            for(let n in relation) {
                if(equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let skills = relation[n].skills;

                for(let o in skills) {
                    let skill = skills[o];

                    if(id === skill.id) {
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

        for(let x in model.bionics) {
            let augmentations = model.bionics[x].augmentations;

            for(let z in augmentations) {
                let skills = augmentations[z].skills;

                for(let a in skills) {
                    let skill = skills[a];

                    if(id === skill.id) {
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

    for(let i in model.primals) {
        let id = model.primals[i].id;

        for(let k in array) {
            let relation = model[array[k]];

            for(let n in relation) {
                if(equipable.indexOf(array[k]) !== -1 && relation[n].equipped === false) continue;

                let primals = relation[n].primals;

                for(let o in primals) {
                    let primal = primals[o];

                    if(id === primal.id) {
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

        for(let i in types) {
            let id = types[i].id;
            let name = types[i].name;
            let key = name.toLowerCase();
            let array = [];

            for(let x in model.attributes) {
                if(model.attributes[x].type.id !== id) continue;

                array.push(model.attributes[x]);
            }

            if(array.length > 0) {
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

        weapons: await request.multiple(req, route + '/weapons'),

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

    model.weapons = await fixWeapons(req, route, model);

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
