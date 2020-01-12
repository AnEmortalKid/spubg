import LocalStorage from "./localStorage";

/**
 * Defines a storage interface, technically a proxy to a real storage class
 */
class Storage {
  constructor(storageProvider) {
    if (!Storage.instance) {
      this.realStorage = storageProvider();
      Storage.instance = this;
    }

    return Storage.instance;
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

  /**
   * Returns all the values in the desired collection
   * @param {String} collection the name of the collection
   * @return objects in the collection, empty if no values are in the collection
   */
  get(collection) {
    return this.realStorage.get(collection);
  }

  /**
   * Stores the value and associates it with the given name. Replacing it if something already existed for that name.
   * @param {String} name the name of the entry
   * @param {Object} value the value to associate with that name
   */
  storeValue(name, value) {
    return this.realStorage.storeValue(name, value);
  }

  /**
   * Retrieves the value associated with the given name, returning null if no value was associated
   * @param {String} name the name of the entry
   */
  getValue(name) {
    return this.realStorage.getValue(name);
  }
}

/**
 * Creates a new storage
 */
export function create() {
  // TODO determine storage provider
  return new Storage(() => new LocalStorage());
}
