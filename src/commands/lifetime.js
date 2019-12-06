import { lifetimeStats } from "../api-client/pubgClient";

export default class LifetimeCommand {
  get description() {
    return " the lifetime statistics";
  }

  execute(args) {
    console.log(`lifetime: ${args}`);
    lifetimeStats(args[0]).then(data =>
      console.log(JSON.stringify(data, null, 2))
    );
  }
}
