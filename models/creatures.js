'use strict';

const request = require('../lib/request');
const root = '/creatures';

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

async function getValues(req, relation, id, extra) {
    return await request.multiple(req, '/' + relation + '/' + id + '/' + extra + '/values');
}

async function getCreatureWeapons(req, model) {
    try {
        let data = [];

        for(let i in model.weapons) {
            let id = model.weapons[i].weapon_id;
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

        for(let i in model.species) {
            if(model.species[i].first === false) continue;

            let id = model.species[i].id;
            let results = await request.multiple(req, '/weapons/species/' + id);

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
        let data = await request.multiple(req, route + '/' + relation);

        for(let i in data) {
            data[i].attributes = await getValues(req, relation, data[i].id, 'attributes');
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

                data[i].augmentations[n].attributes = await getValues(req, 'augmentation', id, 'attributes');
                data[i].augmentations[n].skills = await getValues(req, 'augmentation', id, 'skills');
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

        //console.log(creatureWeapons);
        //console.log(augmentationWeapons);
        //console.log(manifestationWeapons);
        //console.log(speciesWeapons);

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

function calculateAttributes(model) {
    const array = [
        'species',
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

    /*
    For each attribute in creature list,
    loop through each of the relations in array,
    then loop through all objects connected to that relation,
    then loop through all attributes connected to that object,
    then compare creature attribute with the object attribute and add values where appropriate
     */

    for(let i in model.attributes) {
        let id = model.attributes[i].id;

        for(let k in array) {
            let relation = model[array[k]];

            for(let n in relation) {
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

        /*
        Species is different because it only adds on primary(first)
         */

        for(let x in model.species) {
            if(model.species[x].first === false) continue;

            let attributes = model.species[x].attributes;

            for(let z in attributes) {
                let attribute = attributes[z];

                if(id === attribute.id) {
                    model.attributes[i].value += attribute.value;
                }
            }
        }
    }

    return model;
}

function calculateSkills(model) {
    const array = [
        'gifts',
        'imperfections',
        'backgrounds',
        'milestones',
        'bionics',
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

function calculatePrimals(model) {
    const array = [
        'backgrounds',
        'milestones',
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
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function list(req) {
    return await request.get(req, root);
}

async function id(req, id) {
    const route = root + '/' + id;

    let model = {
        creature: await request.single(req, route),

        // Permission
        permissions: await getPermissions(req, route),

        // Single
        world: await request.single(req, route + '/world'),
        epoch: await request.single(req, route + '/epoch'),
        identity: await request.single(req, route + '/identity'),
        nature: await request.single(req, route + '/nature'),
        wealth: await request.single(req, route + '/wealth'),
        country: await request.single(req, route + '/country'),
        corporation: await request.single(req, route + '/corporation'),

        // Arrays
        attributes: await getAttributes(req, route),
        skills: await request.multiple(req, route + '/skills'),
        expertises: await getExpertises(req, route),

        species: await getSpecies(req, route),
        gifts: await getGifts(req, route),
        imperfections: await getImperfections(req, route),
        backgrounds: await getBackgrounds(req, route),
        milestones: await getMilestones(req, route),
        languages: await request.multiple(req, route + '/languages'),

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

        labels: await request.multiple(req, route + '/labels'),
        comments: await request.multiple(req, route + '/comments')
    };

    model.weapons = await fixWeapons(req, route, model);

    model = calculateAttributes(model);
    model = calculateSkills(model);
    model = calculatePrimals(model);

    return model;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.list = list;
module.exports.id = id;
