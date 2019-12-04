export default class KDTrendCommand {
  get description() {
    return "a mapping of kd by season";
  }

  execute(args) {
    console.log(`lifetime: ${args}`);
    lifetimeStatsFor(args[0]).then(data =>
      console.log(JSON.stringify(data, null, 2))
    );
  }
}
