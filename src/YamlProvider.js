const DatabaseError = require("./Error");

const {
    isString,
    isObject,
    isNumber,
    write,
    checkFile,
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

const yaml = require('yaml');






/**
 * @type {YamlDatabase<V>}
 * @template V
 */
class YamlDatabase {

    /** @type {Array<YamlDatabase<unknown>>} */
    static DBCollection = [];

    /** @type {string} @private */
    #databaseName

    constructor(databaseName = "database.yaml") {
        if (!isString(databaseName)) {
            throw new DatabaseError(`Must be a string type json name.`);
        }

        databaseName.endsWith(".yaml") ? void 0 : databaseName = `${databaseName}.yaml`;
        databaseName = `${process.cwd()}/${databaseName}`;
        this.#databaseName = databaseName;
        checkFile(this.#databaseName);
        const repeatingClass = YamlDatabase.DBCollection.find((db) => {
            return db.fileName === this.fileName;
        });
        if (!repeatingClass) YamlDatabase.DBCollection.push(this);
    }

    /**
     * Veri kaydedersiniz.
     * @param {string} key Key
     * @param {V} value Value
     * @example db.set("test",3);
     */
    set(key, value) {
        const parsed = parseKey(key);
        value = parseValue(value);
        const object = this.toJSON();
        if (this.exists(key)) {
            let data = object[parsed.key];
            data = parsed.target ? setData(key, Object.assign({}, data), value) : value;
            object[parsed.key] = data;
            write(this.#databaseName, yaml.stringify(object));
            return object[parsed.key];
        } else {
            object[parsed.key] = parsed.target ? setData(key, {}, value) : value;
            write(this.#databaseName, yaml.stringify(object));
            return object[parsed.key];
        }
    }

    /**
     * Veri çekersiniz.
     * @param {string} key Key
     * @returns {V}
     * @example db.get("test");
     */
    get(key) {
        const parsed = parseKey(key);
        const object = this.toJSON();
        let data = object[parsed.key];
        if (!data) return null;
        if (parsed.target) data = getData(key, Object.assign({}, data));
        return data;
    }
    
    /**
     * Veri çekersiniz.
     * @param {string} key Key
     * @returns {V}
     * @example db.get("test");
     */
    fetch(key) {
        return this.get(key);
    }
    
    exists(key) {
        const parsed = parseKey(key);
        const object = this.toJSON();
        return object[parsed.key] ? true : false;
    }
    
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
        const object = yaml.parse(read(this.#databaseName));
        const arr = [];
        if (object === null) return arr;
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
        if (parsed.target) {
            const _unsetData = unsetData(key, data);
            return this.set(parsed.key, _unsetData);
        } else {
            const all = this.toJSON();
            delete all[parsed.key];
            
            Object.keys(all).length === 0 ? write(this.#databaseName, "") : write(this.#databaseName, yaml.stringify(all));
            return;
        }
    }

    /**
     * Verilerin hepsini siler.
     * @returns {void}
     * @example db.deleteAll();
     */
    deleteAll() {
        write(this.#databaseName, "");
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
     * @param {boolean} [multiple] Multiple
     * @returns {any}
     * @example db.pull("test","hello");
     */
    pull(key, value, multiple = true) {
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
        destroy(this.#databaseName);
        return;
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

    // Getter

    /**
     * @returns {number}
     */
    get size() {
        return this.all().length;
    }

    /**
     * @returns {number}
     */
    get totalDBSize() {
        return YamlDatabase.DBCollection.length;
    }

    get fileName() {
        const splited = this.#databaseName.split("/");
        return splited[splited.length - 1];
    }
}


module.exports = YamlDatabase;