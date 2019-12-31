import KDTrendCommand from "./trends/kdtrend";
import WinRateTrendCommand from "./trends/wrtrend";
import ADRTrendCommand from "./trends/adrtrend";
import AllTrendsCommand from "./trends/alltrends";

import KDCompareCommand from "./comparison/kdCompare";
import ADRCompareCommand from "./comparison/adrCompare";
import WinRateCompareCommand from "./comparison/winRateCompare";
import Top10TrendCommand from "./trends/top10Trend";

const commands = {
  "kd-trend": new KDTrendCommand(),
  "winRate-trend": new WinRateTrendCommand(),
  "adr-trend": new ADRTrendCommand(),
  "top10-trend": new Top10TrendCommand(),
  "all-trends": new AllTrendsCommand(),
  "kd-compare": new KDCompareCommand(),
  "adr-compare": new ADRCompareCommand(),
  "winRate-compare": new WinRateCompareCommand()
};

export function help() {
  console.log("Usage:\n");
  console.log("command <playerName>\n");

  console.log("Available commands are:\n");
  const commandKeys = Object.keys(commands);

  for (const commandKey of commandKeys) {
    const commandEntry = commands[commandKey];
    console.log(`${commandKey}:\t${commandEntry.description}\n`);
  }
}

/**
 * Executes the desired command in a convenient fashion based on the presentation mode
 * @param {String} commandName the name of the command
 * @param {Object} commandOptions options to the command in the form:
 *   {
 *     args: [String],
 *     mode: String
 *   }
 */
export async function execute(commandName, commandOptions) {
  if (commandName == "help") {
    // TODO support modes
    return help();
  }

  console.log(`commandName: ${commandName}`);
  const command = commands[commandName];
  console.log(command.description);
  await commands[commandName].execute(commandOptions);
}
