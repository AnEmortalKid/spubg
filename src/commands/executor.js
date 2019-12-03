import LifetimeCommand from "./lifetime";

const commands = {
  lifetime: new LifetimeCommand()
};

export function help() {
  console.log("help!");
}

export function execute(commandName, commandArgs) {
  if (commandName == "help") {
    return help();
  }

  console.log(`commandName: ${commandName}`);
  const command = commands[commandName];
  console.log(command.description);
  commands[commandName].execute(commandArgs);
}
