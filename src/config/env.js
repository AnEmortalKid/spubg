require("dotenv").config();

export function getToken() {
  return process.env.PUBG_TOKEN;
}

export function getLocalDBPath() {
  return process.env.LOCAL_DB_PATH
    ? process.env.LOCAL_DB_PATH
    : "spubg-db.json";
}

export function getLocalOutputDirectory() {
  return process.env.LOCAL_OUTPUT_PATH ? process.env.LOCAL_OUTPUT_PATH : "out/";
}
