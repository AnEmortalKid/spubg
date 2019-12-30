export default class BaseCommand {
  constructor(description) {
    this._description = description;
  }

  get description() {
    return this._description;
  }
}
