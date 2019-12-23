import chalk from "chalk";
import clear from "clear";
import minimist from "minimist";

import { help, execute } from "./commands/executor";

require("dotenv").config();

// TODO figlet / ascii art

export default function cli(args) {
  const argsObj = minimist(args.slice(2));
  const command = argsObj._[0];
  const commandArgs = argsObj._.slice(1);
  clear();

  console.log(chalk.yellow("SPUBG"));

  if (command == "help") {
    help();
  } else {
    console.log(chalk.green(command));
    console.log(chalk.grey(commandArgs));

    execute(command, commandArgs);
  }
}
