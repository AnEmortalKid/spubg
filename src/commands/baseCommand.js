export default class BaseCommand {
  constructor(description) {
    this._description = description;
  }

  get description() {
    return this._description;
  }

  /**
   * @returns a String explaining the options for this command
   */
  commandOptions(interactionMode) {
    return null;
  }
}
