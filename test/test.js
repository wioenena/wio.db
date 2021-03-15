const { JsonDatabase, YamlDatabase } = require("../index");
const db = new JsonDatabase();
const ydb = new YamlDatabase();


ydb.push("amk",3)