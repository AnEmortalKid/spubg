import LifetimeCommand from "./lifetime";
import KDTrendCommand from "./kdtrend";
import WinRateTrendCommand from "./wrtrend";

const commands = {
  lifetime: new LifetimeCommand(),
  kdTrend: new KDTrendCommand(),
  winrateTrend: new WinRateTrendCommand()
};

export function help() {
  console.log("help!");
}

export async function execute(commandName, commandArgs) {
  if (commandName == "help") {
    return help();
  }

  console.log(`commandName: ${commandName}`);
  const command = commands[commandName];
  console.log(command.description);
  await commands[commandName].execute(commandArgs);
}
