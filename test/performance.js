const { Suite } = require("benchmark");

const suite = new Suite();
const wiodb = new (require("../index").JsonDatabase)({ databaseName: "wiodb" });
const arkdb = new (require("ark.db").Database)("arkdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("lowdb.json");
const lowdb = require("lowdb")(adapter);






suite.add("lowdb set", () => {
    lowdb.set("test.prop", "test").write();
}).add("wio.db set", () => {
    wiodb.set("test.prop", "test");
}).add("ark.db set", () => {
    arkdb.set("test.prop", "test");
}).on("cycle", (e) => {
    console.log(e.target.toString());
}).on("complete", function () {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
}).run();