export default class LifetimeCommand {
  get description() {
    return " the lifetime statistics";
  }

  execute(args) {
    console.log(args);
    console.log(process.env.PUBG_TOKEN);
    console.log("executing LifetimeCommand");
  }
}
