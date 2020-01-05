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
      case "discord":
        return this.discordExecute(args);
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
    console.log("Usage:");
    console.log("<command> playerName... [options]\n");

    console.log("Available commands are:");
    const commandKeys = Object.keys(commands);

    for (const commandKey of commandKeys) {
      this.cliCommandInfo(commandKey);
    }
  }

  cliCommandInfo(commandName) {
    const commandEntry = commands[commandName];
    console.log(commandName + ":");
    console.log(`  ${commandEntry.description}\n`);
  }

  cliExplainCommand(commandName) {
    const commandEntry = commands[commandName];
    if (!commandEntry) {
      console.log(`${commandName} is not a valid command.`);
      this.cliListCommands();
      return;
    }

    this.cliCommandInfo(commandName);

    const options = commandEntry.commandOptions();
    if (options === "") {
      console.log("This command has no options.");
    } else {
      console.log("Options for this command are:\n");
      console.log(options);
    }
  }

  describeCommand(commandName) {
    const commandEntry = commands[commandName];
    const formatted = commandName + ":\n  " + commandEntry.description;
    return formatted;
  }

  discordExecute(args) {
    // TODO use args

    // todo standardize header and reuse in cli
    var commandDescriptions = "";

    const commandKeys = Object.keys(commands);
    for (const commandKey of commandKeys) {
      commandDescriptions += this.describeCommand(commandKey);
      commandDescriptions += "\n";
    }

    var header = "```Usage:\n";
    header += "<command> playerName... [options]\n\n";
    header += "Available commands are:";

    var helpMessage = header + "\n" + commandDescriptions + "```";
    return {
      message: helpMessage
    };
  }
}
