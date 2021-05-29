![Image](https://img.shields.io/npm/v/wio.db?color=%2351F9C0&label=Wio.db) 
![Image](https://img.shields.io/npm/dt/wio.db.svg?color=%2351FC0&maxAge=3600) 
#
<br>

## Yüklemek İçin
```npm
npm install  wio.db
```

# Uyarı || Warning
- Node sürümü 12'den büyük olması gerekli gereklidir.
- Node version must be greater than 12.

# Change Log
- Removed
  - \<db\>.arrayHasValue method.
  - JsonDatabase.DBCollection prop. (static)
  - \<db\>.totalDBSize prop.
- Added
  - \<db\>.filter method.
  - \<db\>.info prop.
  - Options -> maxDataSize
    - Data limit added.
- Updated
  - \<db\>.findAndDelete method.


Some bug fixed and performance improved.

# Speed test
![Speed](https://i.resmim.net/w6lBLB.jpg)

## Nasıl Kullanılır? || how to use?

# JS
```javascript
const {
    JsonDatabase,
    YamlDatabase
} = require("wio.db");

const db = new JsonDatabase({
  databasePath:"./databases/myJsonDatabase.json"
});

const yamldb = new YamlDatabase({
  databasePath: "./databases/myYamlDatabase.yml"
});

// Data set | get
db.set("test", 1);
db.get("test");
db.fetch("test");

// Data exists

db.has("test");
db.exists("test");

// Get all data

db.all(5); || db.all();
db.fetchAll(5); || db.fetchAll();

// To JSON

db.toJson(5); || db.toJson();

// Delete data

db.delete("test");
db.deleteAll();
db.findAndDelete((element,db) => {
    return element.ID.includes("test");
});

// Get data type

db.type("test"); // ---> number

// DB Array methods
db.push("testArray", 10);
db.pull("testArray", (element, index, array) => element < 10, true); // Multiple options = true. (default false)
db.valueArray();
db.keyArray();

// DB Math metods

db.math("test","*", 3);
db.add("test", 10);
db.substr("test", 5);

// DB Finding methods

db.includes("tes");
db.startsWith("t");

// Infos
console.log(db.size);
console.log(db.info);

// Destroy DB
db.destroy();
```
## Bana ulaşabileceğiniz yerler. || Bugs report
[İnstagram](https://www.instagram.com/wioenena.q/)
[Discord](https://discord.gg/BwyEkW4Qax)
