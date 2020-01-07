import KDTrendCommand from "./trends/kdtrend";
import WinRateTrendCommand from "./trends/wrtrend";
import ADRTrendCommand from "./trends/adrtrend";
import AllTrendsCommand from "./trends/alltrends";

import KDCompareCommand from "./comparison/kdCompare";
import ADRCompareCommand from "./comparison/adrCompare";
import WinRateCompareCommand from "./comparison/winRateCompare";
import Top10TrendCommand from "./trends/top10Trend";
import HelpCommand from "./help";

/**
 * Executes the desired command in a convenient fashion based on the presentation mode
 * @param {String} commandName the name of the command
 * @param {Object} commandOptions options to the command in the form:
 *   {
 *     args: [String],
 *     mode: String,
 *     options: {
 *       property: [String],
 *       secondOpt: [String]
 *     }
 *   }
 * @returns a result if the command's execution produces something
 */
export async function execute(commandName, commandOptions) {
  const commands = getCommands();
  const result = await commands[commandName].execute(commandOptions);
  return result;
}

export function getCommands() {
  // use this instead of a const so HelpCommand isn't circularly referential when testing
  return {
    help: new HelpCommand(),
    "kd-trend": new KDTrendCommand(),
    "winRate-trend": new WinRateTrendCommand(),
    "adr-trend": new ADRTrendCommand(),
    "top10-trend": new Top10TrendCommand(),
    "all-trends": new AllTrendsCommand(),
    "kd-compare": new KDCompareCommand(),
    "adr-compare": new ADRCompareCommand(),
    "winRate-compare": new WinRateCompareCommand()
  };
}
