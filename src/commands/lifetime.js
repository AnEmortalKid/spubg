import { lifetimeStatsFor } from "../api-client/pubgClient";

export default class LifetimeCommand {
  get description() {
    return " the lifetime statistics";
  }

  execute(args) {
    console.log(`lifetime: ${args}`);
    lifetimeStatsFor(args[0]);
  }
}
