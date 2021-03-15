const {
    Database,
    read,
    write,
    isString,
    isObject,
    isNumber,
    isFunction,
    parseKey,
    parseValue,
    setData,
    unsetData,
    getData,
    all,
    keyArray,
    valueArray,
    arrayHasValue,
    includes,
    startsWith
} = require("./src/main.js");
const DatabaseError = require("./src/Error");







module.exports = {
    Database,
    read,
    write,
    isString,
    isObject,
    isNumber,
    isFunction,
    parseKey,
    parseValue,
    setData,
    unsetData,
    getData,
    all,
    keyArray,
    valueArray,
    arrayHasValue,
    includes,
    startsWith,
    DatabaseError
};