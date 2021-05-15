const green = (message) => `\x1b[32m${message}\x1b[0m`;

const red = (message) => `\x1b[31m${message}\x1b[0m`;

const yellow = (message) => `\x1b[33m${message}\x1b[0m`;

const advertisement = `${yellow("[ WioDB ] => Information:")} ${green("Come here for help => https://discord.gg/BwyEkW4Qax")}`;









class DatabaseError extends Error {
    constructor(message) {
        super(`${red(message)}\n${advertisement}`);
    }

    get name() {
        return yellow(`[ WioDB ] => ${this.constructor.name}`);
    }
}





module.exports = DatabaseError;