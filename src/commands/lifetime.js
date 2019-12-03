import { findPlayer } from '../api-client/pubgClient'

export default class LifetimeCommand {
  get description() {
    return " the lifetime statistics";
  }

  execute(args) {
    console.log(`lifetime: ${args}`);
    findPlayer(args[0])
  }
}
