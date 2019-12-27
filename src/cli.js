import chalk from "chalk";
import clear from "clear";
import minimist from "minimist";
import { execute } from "./commands/executor";

// TODO figlet / ascii art

export default function cli(args) {
  const argsObj = minimist(args.slice(2));
  const command = argsObj._[0];
  const commandArgs = argsObj._.slice(1);
  clear();

  console.log(chalk.yellow("SPUBG"));

  console.log(chalk.green(command));
  console.log(chalk.grey(commandArgs));

  execute(command, commandArgs);
}
