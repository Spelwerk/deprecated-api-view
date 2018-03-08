'use strict';

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
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

function splitUnderscore(item, keyName) {
    let object = {};

    for (let key in item) {
        if (key.indexOf(keyName) === -1) continue;

        let split = key.split('_')[1];

        object[split] = item[key];
        delete item[key];
    }

    return object;
}

function splitUnderscoreInItem(item) {
    for (let key in item) {
        if (key.indexOf('_') === -1) continue;
        let split = key.split('_')[0];

        item[split] = splitUnderscore(item, split);
    }

    return item;
}

function getSingleFromPlural(route, plural) {
    for (let single in plural) {
        if (!plural.hasOwnProperty(single)) continue;
        if (plural[single] !== route) continue;

        return single;
    }

    return null;
}

function addUniqueItemsToArray(array, input) {
    for (let i in input) {
        let inputItem = input[i];
        let inputExists = false;

        for (let x in array) {
            let arrayItem = array[x];

            if (inputItem.id === arrayItem.id) inputExists = true;
        }

        if (!inputExists) {
            array.push(inputItem);
        }
    }

    return array;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.FLOOR = FLOOR;
module.exports.ROOF = ROOF;
module.exports.MINMAX = MINMAX;

module.exports.splitUnderscore = splitUnderscore;
module.exports.splitUnderscoreInItem = splitUnderscoreInItem;
module.exports.getSingleFromPlural = getSingleFromPlural;
module.exports.addUniqueItemsToArray = addUniqueItemsToArray;