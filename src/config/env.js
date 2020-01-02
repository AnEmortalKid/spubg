require("dotenv").config();

export function getToken() {
  return process.env.PUBG_TOKEN;
}

export function getLocalDBPath() {
  return process.env.LOCAL_DB_PATH
    ? process.env.LOCAL_DB_PATH
    : "spubg-db.json";
}
