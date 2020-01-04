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
   */
  get(collection) {
    if (this.db.has(collection).value()) {
      return this.db.get(collection).value();
    }

    return [];
  }
}
