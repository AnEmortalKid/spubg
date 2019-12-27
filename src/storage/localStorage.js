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

  /**
   * Finds the values from the desired collection which match the search options
   * @param {String} collection the name of the collection
   * @param {Object} searchOptions find filter with attributes and values to search for
   */
  find(collection, searchOptions) {
    return this.db
      .get(collection)
      .find(searchOptions)
      .value();
  }

  /**
   * Stores the desired entity into the given collection
   * @param {String} collection the name of the collection
   * @param {Object} entity the entity to store in that collection
   */
  store(collection, entity) {
    this.db
      .get(collection)
      .push(entity)
      .write();
  }
}

export default new LocalStorage();
