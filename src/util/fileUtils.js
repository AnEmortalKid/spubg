import fs from "fs";

export function onFileExistence(filePath, callback) {
  var count = 0;
  const limit = 5;
  var exists = false;
  function intervalExists() {
    count++;
    exists = fs.existsSync(filePath);
    if (exists) {
      clearInterval(this);
      callback(exists);
    }
    if (count == limit) {
      clearInterval(this);
      callback(exists);
    }
  }
  setInterval(intervalExists, 1000);
}
