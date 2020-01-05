/**
 * Storage that only persists through a local file, useful for the CLI.
 * Singleton entry to consolidate the generation of sources.
 */

import { getLocalDBPath } from "../config/env";

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

export default class LocalStorage {
  constructor() {
    const adapter = new FileSync(getLocalDBPath());
    this.db = low(adapter);
    this.db.defaults({ players: [], seasons: [], history: [] }).write();
  }

  /**
   * Finds the first value from the desired collection which matches the search options
   * @param {String} collection the name of the collection
   * @param {Object} searchOptions find filter with attributes and values to search for
   * @returns null if nothing matched the search options, otherwise the first element found
   */
  find(collection, searchOptions) {
    const found = this.db
      .get(collection)
      .find(searchOptions)
      .value();
    if (found === undefined) {
      return null;
    }
    return found;
  }

  /**
   * Stores the desired entity into the given collection, overriding a value by id
   * @param {String} collection the name of the collection
   * @param {Object} entity the entity to store in that collection
   */
  store(collection, entity) {
    if (entity.id) {
      // if it exist replace it otherwise store it
      if (
        this.db
          .get(collection)
          .find({ id: entity.id })
          .value()
      ) {
        this.db
          .get(collection)
          .find({ id: entity.id })
          .assign(entity)
          .write();
        return;
      }
    }
    // store it as is
    this.db
      .get(collection)
      .push(entity)
      .write();
  }

  /**
   * Returns all the values in the desired collection, or empty if the collection does not exist
   * @param {String} collection the name of the collection
   * @returns the collection values, otherwise empty
   */
  get(collection) {
    if (this.db.has(collection).value()) {
      return this.db.get(collection).value();
    }

    return [];
  }
}
