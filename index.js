const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("cats.json");
const db = low(adapter);

db.defaults({ cats: [] }).write();


const felix = db.get("cats").find({id: "1"}).value()
if (!felix) {
  console.log("storing felix");
  db.get("cats")
    .push({ name: "felix", id: "1" })
    .write();
}

console.log(felix);
