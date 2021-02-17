










declare module "wio.db" {
    export class Database<V> {
        private databaseName: string;
        public constructor(databaseName?: string);
        private handle(): boolean;
        private save(): boolean;
        public set(key: string, value: V): V;
        public get(key: string): V;
        public fetch(key: string): V;
        public exist(key: string): boolean;
        public has(key: string): boolean;
        public all(limit?: number): Array<{ ID: string, data: V }>;
        public fetchAll(limit?: number): Array<{ ID: string, data: V }>;
        public toJSON(limit?: number): Object;
        public delete(key: string): void;
        public deleteAll(): void;
        public type(key: string): string | number | bigint | boolean | symbol | Array | undefined | object | Function;
        public pull(key: string, value: V, multiple?: boolean): V;
        public valueArray(): V[];
        public keyArray(): string[];
        public math(key: string, operator: "+" | "-" | "*" | "/" | "%", value: V, goToNegative?: boolean): V;
        public add(key: string, value: V): V;
        public substr(key: string, value: V): V;
        public push<T>(key: string, value: T): V;
        public arrayHasValue<T>(key: string, value: T | T[]): boolean | object;
        public includes(key: string): object;
        public startsWith(key: string): object;
        public destroy(): void;
    };
    export function read(fileName: string): object;
    export function write(fileName: string, data: object): void;
    export function isString(value: any): boolean;
    export function isObject(value: any): boolean;
    export function isNumber(value: any): boolean;
    export function isFunction(value: any): boolean;
    export function parseKey(key: string): { key: string, target?: string };
    export function parseValue(value: any): any;
    export function setData(key: string, data: any, value: any): object;
    export function unsetData(key: string, data: any): object;
    export function getData(key: string, data: any): any;
    export function all(arrayData: any[], limit?: number): Array<{ ID: string, data: any }>;
    export function keyArray(array: any[]): string[];
    export function valueArray(array: any[]): any[];
    export function arrayHasValue(data: any, value: any | any[]): boolean | object;
    export function includes(key: string, keyArray: string[], json: object): object;
    export function startsWith(key: string, keyArray: string[], json: object): object;
}