import KDTrendCommand from "./trends/kdtrend";
import WinRateTrendCommand from "./trends/wrtrend";
import ADRTrendCommand from "./trends/adrtrend";
import AllTrendsCommand from "./trends/alltrends";

const commands = {
  "kd-trend": new KDTrendCommand(),
  "winRate-trend": new WinRateTrendCommand(),
  "adr-trend": new ADRTrendCommand(),
  "all-trends": new AllTrendsCommand()
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
