import fs from "fs";
import path from "path";

function createTempDB() {
  console.log("writing test db");

  fs.mkdirSync("temp", { recursive: true });
  fs.writeFileSync(path.resolve("temp/", "testdb.json"), "{}");
}

module.exports = function() {
  createTempDB();
};
