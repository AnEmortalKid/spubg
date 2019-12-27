/**
 * Storage that only persists through a local file, useful for the CLI.
 * Singleton entry to consolidate the generation of sources.
 */

import { getLocalDBPath } from "../config/env";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

class LocalStorage {
  constructor() {
    const adapter = new FileSync(getLocalDBPath());
    this.db = low(adapter);
    this.db.defaults({ players: [], seasons: [], history: [] }).write();
  }

  instance() {
    return this.db;
  }
}

export default new LocalStorage();
