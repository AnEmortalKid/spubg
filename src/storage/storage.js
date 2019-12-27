import LocalStorage from "./localStorage";

/**
 * Defines a storage interface, technically a proxy to a real storage class
 */
class Storage {
  constructor(realStorage) {
    this.realStorage = realStorage;
  }

  /**
   * Finds the values from the desired collection which match the search options
   * @param {String} collection the name of the collection
   * @param {Object} searchOptions find filter with attributes and values to search for
   */
  find(collection, searchOptions) {
    return this.realStorage.find(collection, searchOptions);
  }

  /**
   * Stores the desired entity into the given collection
   * @param {String} collection the name of the collection
   * @param {Object} entity the entity to store in that collection
   */
  store(collection, entity) {
    return this.realStorage.store(collection, entity);
  }
}

/**
 * Creates a new storage
 */
export function create() {
  // TODO wire mechanism for remote storage
  return new Storage(LocalStorage);
}
