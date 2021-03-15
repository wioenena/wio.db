const { Database } = require("../index.js");
const db = new Database("db1");
const db2 = new Database("db2");

console.log(db2.totalDBSize)