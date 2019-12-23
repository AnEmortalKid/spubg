import KDTrendCommand from "./kdtrend";
import WinRateTrendCommand from "./wrtrend";
import ADRTrendCommand from "./adrtrend";

const commands = {
  "kd-trend": new KDTrendCommand(),
  "winRate-trend": new WinRateTrendCommand(),
  "adr-trend": new ADRTrendCommand()
};

export function help() {
  console.log("Available commands are:\n");
  const commandKeys = Object.keys(commands);

  for (const commandKey of commandKeys) {
    const commandEntry = commands[commandKey];
    console.log(`${commandKey}:\t${commandEntry.description}\n`);
  }
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
