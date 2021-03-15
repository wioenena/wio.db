










declare module "wio.db" {
    export class JsonDatabase<V> {
        public static DBCollection: Array<Database<unknown>>;
        private databaseName: string;
        public constructor(databaseName?: string);
        private handle(): boolean;
        private save(): boolean;
        public set(key: string, value: V): V;
        public get(key: string): V;
        public fetch(key: string): V;
        public exists(key: string): boolean;
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
        public findAndDelete(callbackfn: (key: string, value: V) => boolean): number;
        public destroy(): void;
        public get size(): number;
        public get totalDBSize(): number;
        public get fileName(): string;
    }

    export class YamlDatabase<V> {

        public static DBCollection: Array<Database<unknown>>;
        private databaseName: string;
        public constructor(databaseName?: string);
        private handle(): boolean;
        private save(): boolean;
        public set(key: string, value: V): V;
        public get(key: string): V;
        public fetch(key: string): V;
        public exists(key: string): boolean;
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
        public findAndDelete(callbackfn: (key: string, value: V) => boolean): number;
        public destroy(): void;
        public get size(): number;
        public get totalDBSize(): number;
        public get fileName(): string;
    }

    export class DatabaseError extends Error {
        public constructor(message: string);
        public get name(): string;
    }
}