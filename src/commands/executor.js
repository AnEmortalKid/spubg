import AllTrendsCommand from "./trends/allTrends";
import ADRTrendCommand from "./trends/adrTrend";
import KDTrendCommand from "./trends/kdTrend";
import WinRateTrendCommand from "./trends/winRateTrend";

import ADRCompareCommand from "./comparison/adrCompare";
import KDCompareCommand from "./comparison/kdCompare";
import WinRateCompareCommand from "./comparison/winRateCompare";
import Top10TrendCommand from "./trends/top10Trend";

import HelpCommand from "./help";

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
  if (commandName === "help") {
    return new HelpCommand(commands).execute(commandOptions);
  }

  const result = await commands[commandName].execute(commandOptions);
  return result;
}
