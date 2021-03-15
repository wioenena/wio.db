const {
    existsSync,
    writeFileSync,
    unlinkSync,
    readFileSync
} = require("fs");
const DatabaseError = require("./Error");

const { set, unset, get, cloneDeep } = require("lodash");


const isString = (value) => typeof value !== "string" || value === "" ? false : true;

const isObject = (value) => {
    if (value.toString() === "[object Object]") return true;
    if (Array.isArray(value)) return false;
    if (value.constructor.name !== "object") return false;
    return true;
};

const isNumber = (value) => {
    if (typeof value === "number") return true;
    return false;
};

const isFunction = (value) => typeof value === "function";

const write = (fileName, data) => {
    writeFileSync(fileName, data);
    return;
};

const checkFile = (fileName, data = "") => {
    const { existsSync } = require('fs');
    if (existsSync(fileName)) {
        return true;
    } else {
        write(fileName, data);
    }
};

/**
 * @param {string} key
 * @returns {{key:string,target?:string}}
 */
const parseKey = (key) => {
    if (!isString(key)) {
        throw new DatabaseError(`The key must be string type data.`);
    }
    if (key.includes(".")) {
        const parsedDot = key.split(".");
        const targetKey = parsedDot.shift();
        const target = parsedDot.join(".");
        return { key: targetKey, target };
    }
    return { key, target: undefined };
};

/**
 * @param {any} value
 * @returns {any}
 */
const parseValue = (value) => {
    if ((!value || value === "") && !isNumber(value)) throw new DatabaseError(`The value was specified incorrectly.`);
    return value;
};

/**
 * @param {string} key
 * @param {any} data
 * @param {any} value
 * @returns {object}
 */
const setData = (key, data, value) => {
    const parsed = parseKey(key);
    if (isObject(data) && parsed.target) {
        return set(data, parsed.target, value);
    } else if (parsed.target) {
        throw new DatabaseError(`${data}'s type is not object.`);
    }
    return data;
};


/**
 * @param {string} key
 * @param {any} data
 * @returns {object}
 */
const unsetData = (key, data) => {
    const parsed = parseKey(key);
    const cloned = cloneDeep(data);
    if (isObject(data) && parsed.target) {
        unset(cloned, parsed.target);
    } else if (parsed.target) {
        throw new DatabaseError(`${data}'s type is not object.`);
    }
    return cloned;
};


/**
 * @param {string} key
 * @param {any} data
 * @returns {any} 
 */
const getData = (key, data) => {
    const parsed = parseKey(key);
    if (parsed.target) data = get(data, parsed.target);
    return data;
};

const read = (filePath) => {
    return readFileSync(filePath, "utf-8");
};

const destroy = (filePath) => {
    unlinkSync(filePath);
    return;
};


/**
 * @param {any[]} arrayData
 * @param {number} [limit]
 * @returns {Array<{ID:string,data:any}>}
 */
const all = (arrayData, limit) => {
    if (limit) arrayData = arrayData.slice(0, limit);
    return arrayData.map((item) => ({ ID: item.ID, data: item.data }));
};

/**
 * @param {any[]} array
 * @returns {string[]}
 */
const keyArray = (array) => {
    return array.map((item) => item.ID);
};

/**
 * @param {any[]} array
 * @returns {any[]}
 */
const valueArray = (array) => {
    return array.map((item) => item.data);
};

/**
 * @param {any} data
 * @param {any} value
 * @returns {boolean | object}
 */
const arrayHasValue = (data, value) => {
    if (Array.isArray(value)) {
        const obj = {};
        value.forEach((item) => {
            const check = data.some((i) => i === item);
            if (check) obj[item] = true;
            else obj[item] = false;
        });
        return obj;
    }
    return data.some((item) => item === value);
};

/**
 * @param {string} key
 * @param {string[]} keyArray
 * @param {object} json
 * @returns {object}
 */
const includes = (key, keyArray, json) => {
    keyArray = keyArray.filter((item) => item.includes(key));
    if (keyArray.length < 1) return {};
    const obj = {};
    for (const key of keyArray) {
        obj[key] = json[key];
    }
    return obj;
};

/**
 * @param {string} key
 * @param {string[]} keyArray
 * @param {object} json
 * @returns {object}
 */
const startsWith = (key, keyArray, json) => {
    keyArray = keyArray.filter((item) => item.startsWith(key));
    if (keyArray.length < 1) return {};
    const obj = {};
    for (const key of keyArray) {
        obj[key] = json[key];
    }
    return obj;
};


module.exports = {
    isString,
    isObject,
    isNumber,
    isFunction,
    write,
    checkFile,
    parseKey,
    parseValue,
    setData,
    unsetData,
    getData,
    read,
    destroy,
    all,
    keyArray,
    valueArray,
    arrayHasValue,
    includes,
    startsWith
};
