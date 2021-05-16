const { JsonDatabase } = require("../index");








describe("Json class all controls", () => {
    it("databaseName with process.cwd()", () => {
        console.log(
            new JsonDatabase(
                {
                    databaseName: `${process.cwd()}/databases/example1/example1.json`
                }
            ).path
        );
    });

    it("databaseName with './'", () => {
        console.log(
            new JsonDatabase(
                {
                    databaseName: "./databases/example2/example2.json"
                }
            ).path
        );
    });

    it("databaseName with /", () => {
        console.log(
            new JsonDatabase(
                {
                    databaseName: "/databases/example3/example3.json"
                }
            ).path
        );
    });

    it("Max limit with non-number", () => {
        console.log(
            new JsonDatabase(
                {
                    maxData: "3" // -> Error
                }
            ).maxData
        );
    });

    it("Max limit with negative number", () => {
        console.log(
            new JsonDatabase(
                {
                    maxData: -1 // -> Error
                }
            )
        );
    });

    const db = new JsonDatabase(
        {
            databaseName: "/databases/example3/example3.json",
            maxData: 100
        }
    );
    
    it("set without key", () => {
        db.set(); // -> Error
    });

    it("set without value", () => {
        db.set("test"); // -> Error
    });

    it("set with autoWrite type non-boolean", () => {
        db.set("test", "value", "test"); // -> Error
    });

    it("set with confirmed parameters", () => {
        db.set("test", "value"); // -> returns "value"
        console.log(db.set("test2.obj", { succes: true })); // -> returns { succes: true } 
        console.log(db.set("test3", "value", false)); // -> returns "value"
    });

    it("get without default value", () => {
        console.log(db.get("notExists")); // -> returns null
    });

    it("get with default value", () => {
        console.log(db.get("notExists", "default")); // -> returns "default"
    });

    it("fetch without default value", () => {
        console.log(db.fetch("notExists")); // -> returns null
    });

    it("fetch with default value", () => {
        console.log(db.fetch("notExists", "default")); // -> returns "default"
    });

    it("exists", () => {
        console.log(db.exists("test")); // -> returns true
        console.log(db.exists("notExists")); // -> returns false
        console.log(db.exists("test3")); // That's right because it's in the cache 
    });

    it("has", () => {
        console.log(db.has("test")); // -> returns true
        console.log(db.has("notExists")); // -> returns false
        console.log(db.has("test3")); // That's right because it's in the cache 
    });

    it("all with limit", () => {
        console.log(db.all(2)); 
    });

    it("all without limit", () => {
        console.log(db.all());
    });

    it("fetchAll with limit", () => {
        console.log(db.fetchAll(2)); 
    });

    it("fetchAll without limit", () => {
        console.log(db.fetchAll());
    });

    it("toJSON with limit", () => {
        console.log(db.toJSON(2));
    });

    it("toJSON without limit", () => {
        console.log(db.toJSON());
    });

    it("delete with autoWrite", () => {
        db.delete("test2");
        console.log(db.size);
    });

    it("delete without autoWrite", () => {
        db.delete("test3", false);
        console.log(db.all());
        console.log(db.size);
    });

    it("deleteAll", () => {
        db.deleteAll();
        console.log(db.size); // -> 0
    });

    it("type", () => {
        console.log(db.type("test")); // -> returns "string"
    });

    it("pull", () => {
        db.set("myArray1", [1, 2, 3, 4, 5]);
        db.set("myArray2", ["test1", "test2", "test3"]);
        db.set("myArray3", [{ first: "first" }, { second: "second" }]);

        db.pull("myArray1", (element, index, array) => element < 3, true);
        db.pull("myArray2", (element, index, array) => element.startsWith("test"), true);
        db.pull("myArray3", (element, index, array) => !!element?.second);
    });

    it("valueArray", () => {
        console.log(db.valueArray());
    });

    it("keyArray", () => {
        console.log(db.keyArray()); 
    });

    it("math +", () => {
        db.math("testForMath", "+", 10);
        console.log(db.get("testForMath"));
    });

    it("math -", () => {
        db.math("testForMath", "-", 5); 
        console.log(db.get("testForMath"));
    });

    it("math *", () => {
        db.math("testForMath", "*", 10);
        console.log(db.get("testForMath"));
    });

    it("math /", () => {
        db.math("testForMath", "/", 5);
        console.log(db.get("testForMath"));
    });

    it("math %", () => {
        db.math("testForMath", "%", 2);
        console.log(db.get("testForMath"));
    });

    it("includes", () => {
        console.log(db.includes("tes"));
    });

    it("startsWith", () => {
        console.log(db.startsWith("te"));
    });

    it("some", () => {
        db.deleteAll();
        db.set("someTest1", 10);
        db.set("someTest2", 20);
        db.set("someTest3", 15);
        console.log(db.sort((a, b) => b.data - a.data));
    });

    it("size", () => {
        console.log(db.size);
    });

    it("info", () => {
        console.log(db.info);
    });
});