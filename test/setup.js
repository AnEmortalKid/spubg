import fs from "fs";
import path from "path";

function createTempDirectory() {
  logMsg("creating temp directory");
  fs.mkdirSync("temp", { recursive: true });
  process.env.LOCAL_OUTPUT_PATH = "temp/";
}

function createTempDB() {
  logMsg("creating testdb.json");
  fs.writeFileSync(path.resolve("temp/", "testdb.json"), "{}");
}

function logMsg(msg) {
  console.log(`[globalSetup] ${msg}`);
}

module.exports = function() {
  logMsg("start");
  createTempDirectory();
  createTempDB();
  logMsg("end");
};
