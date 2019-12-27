import dotenv from "dotenv";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

export function getToken() {
  return process.env.PUBG_TOKEN;
}

export function getLocalDBPath() {
  return process.env.LOCAL_DB_PATH
    ? process.env.LOCAL_DB_PATH
    : "spubg-db.json";
}
