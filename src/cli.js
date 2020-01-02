import chalk from "chalk";
import clear from "clear";
import { execute } from "./commands/executor";
import { parseArguments } from "./args/argParser";

// TODO figlet / ascii art

export default function cli(args) {
  const argsObj = args.slice(2);
  const command = argsObj[0];
  const commandArgs = argsObj.slice(1);
  clear();

  console.log(chalk.yellow("SPUBG"));
  const parsed = parseArguments(commandArgs);

  execute(command, {
    args: parsed.args,
    options: parsed.options,
    mode: "cli"
  });
}
