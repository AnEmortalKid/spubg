import BaseCommand from "./baseCommand";
import { commands } from "./executor";

export default class HelpCommand extends BaseCommand {
  constructor(description) {
    super(
      "displays this message. Get additional help by doing help <command>."
    );
  }

  execute(commandOptions) {
    const args = commandOptions.args;
    switch (commandOptions.mode) {
      case "cli":
        return this.cliExecute(args);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  cliExecute(args) {
    if (args[0]) {
      this.cliExplainCommand(args[0]);
    } else {
      this.cliListCommands();
    }
  }

  cliListCommands() {
    console.log("Usage:\n");
    console.log("<command> playerName... [options]\n");

    console.log("Available commands are:\n");
    const commandKeys = Object.keys(commands);

    for (const commandKey of commandKeys) {
      const commandEntry = commands[commandKey];
      console.log(`${commandKey}:\t${commandEntry.description}\n`);
    }
  }

  cliExplainCommand(commandName) {
    const commandEntry = commands[commandName];
    if (!commandEntry) {
      console.log(`${commandName} is not a valid command.`);
      this.cliListCommands();
      return;
    }

    console.log(`${commandName}:\t${commandEntry.description}\n`);

    const options = commandEntry.commandOptions();
    if (options === "") {
      console.log("This command has no options.");
    } else {
      console.log("Options for this command are:\n");
      console.log(options);
    }
  }
}
