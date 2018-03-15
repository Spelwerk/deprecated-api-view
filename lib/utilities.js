'use strict';

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
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

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

function floor(number, min) {
    number = parseInt(number) || min;
    number = number < min
        ? min
        : number;

    return number;
}

function roof(number, max) {
    number = parseInt(number) || max;
    number = number > max
        ? max
        : number;

    return number;
}

function minMax(number, min, max) {
    return roof(floor(number, min), max);
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

function sortArrayOnProperty(array, property) {
    array.sort((a, b) => {
        let propA = a[property].toUpperCase();
        let propB = b[property].toUpperCase();

        if (propA < propB) {
            return -1;
        } else if (propA > propB) {
            return 1;
        } else {
            return 0;
        }
    });
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports.floor = floor;
module.exports.roof = roof;
module.exports.minMax = minMax;
module.exports.splitUnderscoreInItem = splitUnderscoreInItem;
module.exports.getSingleFromPlural = getSingleFromPlural;
module.exports.addUniqueItemsToArray = addUniqueItemsToArray;
module.exports.sortArrayOnProperty = sortArrayOnProperty;