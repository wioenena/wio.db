![Image](https://img.shields.io/npm/v/wio.db?color=%2351F9C0&label=Wio.db) 
![Image](https://img.shields.io/npm/dt/wio.db.svg?color=%2351FC0&maxAge=3600) 
#
![Image](https://nodei.co/npm/wio.db.png?downloads=true&downloadRank=true&stars=true)
<br>

## Yüklemek İçin
```npm
npm install  wio.db
```

# Uyarı || Warning
- Node sürümü 14 gereklidir.
- Node version 14 is required

## Nasıl Kullanılır? || how to use?
# TypeScript
```typescript
import db from "wio.db"
```
# JS
```javascript
const { Database } = require("wio.db");
const  db  = new Database("myDatabase");
db.set("test",1);
db.get("test");
db.fetch("test");
db.exist("test");
db.has("test");
db.all(5);
db.fetchAll();
db.toJSON();
db.delete("test");
db.deleteAll();
db.type("test");
db.pull("test",3);
db.valueArray();
db.keyArray();
db.math("test","*",5);
db.add("test",5);
db.substr("test",5);
db.push("test","arrayPush");
db.arrayHasValue("test",["arrayPush","test2"] || "test2");
db.includes("tes");
db.startsWith("te");
db.destroy();
```
## Bana ulaşabileceğiniz yerler. || Bugs report
[İnstagram](https://www.instagram.com/wioenena.q/)
