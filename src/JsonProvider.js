const DatabaseError = require("./Error");

const {
    isNumber,
    write,
    parseKey,
    parseValue,
    setData,
    getData,
    unsetData,
    read,
    destroy,
    all,
    keyArray,
    valueArray,
    arrayHasValue,
    includes,
    startsWith
} = require("./Util");
const path = require('path');
const {
    existsSync,
    mkdirSync,
    writeFileSync,
    readFileSync
} = require("fs");
const { set, get } = require("lodash");










/**
 * @type {JsonDatabase<V>}
 * @template V
 */
class JsonDatabase {

    /**
     * @private
     * @type {object}
     */
    #cache = {};
    
    /**
     * @param {import("./Types/IOptions").IOptions} options
     * @constructor
     */
    constructor({
        databaseName = "db.json",
        maxData = null
    } = {}) {

        if (maxData !== null && typeof maxData !== "number") {
            throw new DatabaseError("The maximum limit must be in number type!");
        } else {
            if (maxData < 1) {
                throw new DatabaseError("Inappropriate range for the limit!");
            }
        }

        
        let basePath = process.cwd();

        if (databaseName.startsWith(basePath)) {
            databaseName = databaseName.replace(basePath, "");
        }

        if (databaseName.startsWith("./")) {
            databaseName = databaseName.slice(1);
        }

        if (!databaseName.startsWith(path.sep)) {
            databaseName = path.sep + databaseName;
        }

        
        if (!databaseName.endsWith(".json")) {
            databaseName += "db.json";
        }

        basePath = `${basePath}${databaseName}`;

        const dirNames = databaseName.split(path.sep).slice(1);
        
        const length = dirNames.length;

        if (length > 1) {
            dirNames.pop();

            const firstResolvedDir = path.resolve(dirNames[0]);

            if (!existsSync(firstResolvedDir)) {
                mkdirSync(firstResolvedDir);
            }

            dirNames.splice(0, 1);

            let targetDirPath = firstResolvedDir;

            for (const dirName of dirNames) {
                const currentPath = `${targetDirPath}/${dirName}`
                
                if (!existsSync(currentPath)) {
                    mkdirSync(currentPath);
                }

                targetDirPath = `${targetDirPath}/${dirName}`;
            }
        }

        this.path = basePath;

        if (!existsSync(this.path)) {
            writeFileSync(this.path, "{}");
        } else {
            this.#cache = JSON.parse(readFileSync(this.path, "utf-8"));
        }
        
        /**
         * @type {number}
         */
        this.maxData = maxData;

        this.size = 0;
    }

    /**
     * Veri kaydedersiniz.
     * @param {string} key Key
     * @param {V} value Value
     * @param {boolean} [autoWrite=true]
     * @example db.set("test",3);
     */
    set(key, value, autoWrite=true) {

        if (key === "" || typeof key !== "string") {
            throw new DatabaseError("Unapproved key!");
        }

        if (
            // @ts-ignore
            value === "" ||
            value === undefined ||
            value === null
        ) {
            throw new DatabaseError("Unapproved value!");
        }

        if (typeof autoWrite !== "boolean") {
            throw new DatabaseError("AutoWrite value must be true or false!");
        }

        if (typeof this.maxData === "number" && this.size >= this.maxData) {
            throw new DatabaseError("Data limit exceeded!");
        }

        set(this.#cache, key, value);

        if (autoWrite)
            writeFileSync(this.path, JSON.stringify(this.#cache, null, 4));

        this.size++;

        return value;
    }

    /**
     * Veri çekersiniz.
     * @param {string} key Key
     * @param {V} [defaultValue=null] If there is no value, the default value to return.
     * @returns {V}
     * @example db.get("test");
     */
    get(key, defaultValue = null) {
        return get(this.#cache, key) || defaultValue;
    }
    
    /**
     * Veri çekersiniz.
     * @param {string} key Key
     * @param {V} [defaultValue=null] If there is no value, the default value to return.
     * @returns {V}
     * @example db.get("test");
     */
    fetch(key,defaultValue) {
        return this.get(key, defaultValue);
    }

    /**
     * Veri var mı yok mu kontrol eder.
     * @param {string} key Key
     * @returns {boolean}
     * @example db.exists("test");
     */
    exists(key) {
        const data = this.get(key);
        return data !== undefined && data !== null;
    }

    /**
     * Veri var mı yok mu kontrol eder.
     * @param {string} key Key
     * @returns {boolean}
     * @example db.has("test");
     */
    has(key) {
        return this.exists(key);
    }

    /**
     * Belirtilen miktarda veri döner.
     * @param {number} limit Limit
     * @returns {Array<{ID:string,data:V}>}
     * @example db.all(5);
     */
    all(limit = 0) {
        if (!isNumber(limit) || limit < 1) limit = 0;
        const object = JSON.parse(read(this.path));
        const arr = [];
        for (const key in object) {
            const obj = {
                ID: key,
                data: object[key]
            };
            arr.push(obj);
        }
        return all(arr, limit);
    }

    /**
     * Belirtilen miktarda veri döner.
     * @param {number} [limit] Limit
     * @returns {Array<{ID:string,data:V}>}
     * @example db.fetchAll(5);
     */
    fetchAll(limit) {
        return this.all(limit);
    }

    /**
     * Belirtilen miktarda Object tipinde verileri döner.
     * @param {number} [limit] Limit
     * @returns {Object}
     * @example db.toJSON();
     */
    toJSON(limit) {
        const allData = this.all(limit);
        const json = {};
        allData.forEach((item) => {
            json[item.ID] = item.data;
        });
        return json;
    }

    /**
     * Veri siler.
     * @param {string} key Key
     * @returns {void}
     * @example db.delete("test");
     */
    delete(key) {
        const parsed = parseKey(key);
        if (!this.has(parsed.key)) {
            throw new DatabaseError(`${parsed.key} There is no data with ID, I cannot delete it.`);
        }
        const data = this.get(parsed.key);
        this.size--;
        if (parsed.target) {
            const _unsetData = unsetData(key, data);
            return this.set(parsed.key, _unsetData);
        } else {
            const all = this.toJSON();
            delete all[parsed.key];
            write(this.path, JSON.stringify(all, null, 4));
            return;
        }
    }

    /**
     * Verilerin hepsini siler.
     * @returns {void}
     * @example db.deleteAll();
     */
    deleteAll() {
        write(this.path, "{}");
        this.size = 0;
        return;
    }

    /**
     * @param {string} key Key
     * @returns {"string" | "number" | "bigint" | "boolean" | "symbol" | "array" | "undefined" | "object" | "function"}
     * @example db.type("test");
     */
    type(key) {
        const data = this.get(key);
        if (Array.isArray(data)) return "array";
        else return typeof data;
    }

    /**
     * Array'den veri siler.
     * @param {string} key Key
     * @param {V | V[]} value Value
     * @returns {any}
     * @example db.pull("test","hello");
     */
    pull(key, value) {
        value = parseValue(value);
        /** @type {V[] | V} */
        let data = this.get(key);
        if (!data) return false;
        if (!Array.isArray(data)) throw new DatabaseError(`${key} It is not a data string with an ID.`);
        if (Array.isArray(value)) {
            // @ts-ignore
            data = data.filter((item) => !value.includes(item));
            // @ts-ignore
            return this.set(key, data);
        } else {
            const hasItem = data.some((item) => item === value);
            if (!hasItem) return false;
            const index = data.findIndex((item) => item === value);
            data = data.filter((item, i) => i !== index);
            // @ts-ignore
            return this.set(key, data);
        }
    }

    /**
     * Value'leri array şeklinde döner.
     * @returns {V[]} Values[]
     * @example db.valueArray();
     */
    valueArray() {
        const all = this.all();
        return valueArray(all);
    }

    /**
     * ID'leri array şeklinde döner.
     * @returns {string[]} ID[]
     * @example db.keyArray();
     */
    keyArray() {
        const all = this.all();
        return keyArray(all);
    }
    
    /**
     * Matematik işlemleri yapar.
     * @param {string} key Key
     * @param {"+" | "-" | "*" | "/" | "%"} operator Operator
     * @param {number} value Value
     * @param {boolean} [goToNegative] Verinin -'lere düşüp düşmeyeceği. (default false)
     * @returns {any}
     * @example db.math("test","/",5,false);
     */
    math(key, operator, value, goToNegative = false) {
        if (!isNumber(value)) throw new DatabaseError(`The type of value is not a number.`);
        if (value <= 0) throw new DatabaseError(`Value cannot be less than 1.`);
        value = Number(value);
        if (!(typeof goToNegative === "boolean")) throw new DatabaseError(`The goToNegative parameter must be of boolean type.`);
        let data = this.get(key);
        if (!data && !isNumber(data)) {
            // @ts-ignore
            return this.set(key, value);
        }
        if (!isNumber(data)) throw new DatabaseError(`${key} ID data is not a number type data.`);
        // @ts-ignore
        data = Number(data);
        switch (operator) {
            case "+":
                // @ts-ignore
                data += value;
                return this.set(key, data);
                break;
            case "-":
                // @ts-ignore
                data -= value;
                // @ts-ignore
                if (goToNegative === false && data < 1) data = 0;
                return this.set(key, data);
                break;
            case "*":
                // @ts-ignore
                data *= value;
                return this.set(key, data);
                break;
            case "/":
                // @ts-ignore
                data /= value;
                return this.set(key, data);
                break;
            case "%":
                // @ts-ignore
                data %= value;
                return this.set(key, data);
                break;
            default:
                return undefined;
                break;
        }
    }

    /**
     * Toplama işlemi yapar.
     * @param {string} key Key
     * @param {number} value Value
     * @returns {any}
     * @example db.add("test",5,false);
     */
    add(key, value) {
        const result = this.math(key, "+", value);
        return result;
    }

    /**
     * Çıkarma işlemi yapar.
     * @param {string} key Key
     * @param {number} value Value
     * @param {boolean} [goToNegative] Eksilere düşüp düşmeyeceği
     * @returns {any}
     * @example db.substr("test",2,false);
     */
    substr(key, value, goToNegative) {
        const result = this.math(key, "-", value, goToNegative);
        return result;
    }
    
    /**
     * Array'a veri ekler.
     * @param {string} key Key
     * @param {T} value Value
     * @template T
     * @returns {V}
     * @example db.push("test","succes");
     */
    push(key, value) {
        const data = this.get(key);
        if (!data) {
            // @ts-ignore
            return this.set(key, [value]);
        }
        if (Array.isArray(data)) {
            data.push(value);
            return this.set(key, data);
        } else {
            // @ts-ignore
            return this.set(key, [value]);
        }
    }

    /**
     * Array'da value varmı yokmu kontrol eder.
     * @param {string} key Key
     * @param {T | T[]} value Value
     * @template T
     * @return {any}
     * @example db.arrayHasValue("test",["succes","hello"]);
     */
    arrayHasValue(key, value) {
        const data = this.get(key);
        if (!data) throw new DatabaseError(`No data with ${key} ID in DataBase.`);
        if (!Array.isArray(data)) throw new DatabaseError(`The data named ${key} in the DataBase is not of type array.`);
        return arrayHasValue(data, value);
    }

    /**
     * Database'de ID'lerin içinde belirtilen veri varsa o verileri getirir.
     * @param {string} key Key
     * @returns {Object}
     * @example db.includes("te");
     */
    includes(key) {
        const keyArray = this.keyArray();
        const json = this.toJSON();
        return includes(key, keyArray, json);
    }

    /**
     * Database'de ID'leri belirtilen veri ile başlayan verileri getirir.
     * @param {string} key Key
     * @returns {Object}
     * @example db.startsWith("te");
     */
    startsWith(key) {
        const keyArray = this.keyArray();
        const json = this.toJSON();
        return startsWith(key, keyArray, json);
    }

    /**
     * İsmi belirtilen database dosyasını siler.
     * @returns {void}
     */
    destroy() {
        return destroy(this.path);
    }

    /**
     * Çagrılan fonksiyon true değer dönerse onunla bağlantılı olan verileri siler.
     * @param {(key:string,value:V) => boolean} callbackfn
     * @returns {number}
     */
    findAndDelete(callbackfn) {
        let deletedSize = 0;
        const all = this.all();
        for (const item of all) {
            if (callbackfn(item.ID, item.data)) {
                this.delete(item.ID);
                deletedSize++;
            }
        }
        return deletedSize;
    }

    /**
     * @returns {string}
     */
    get fileName() {
        const splited = this.path.split("/");
        return splited[splited.length - 1];
    }
}












module.exports = JsonDatabase;