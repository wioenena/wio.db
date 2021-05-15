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
            maxData: 10
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
        db.set("test", 3); // -> returns 3
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
});