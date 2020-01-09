import fs from "fs";

function logMsg(msg) {
  console.log(`[globalTeardown] ${msg}`);
}

function removeTempDirectory() {
  logMsg("removing temp directory");
  fs.rmdirSync("temp", { recursive: true });
}

module.exports = function() {
  logMsg("start");
  removeTempDirectory();
  logMsg("end");
};
