import BaseCommand from "./baseCommand";
import { InteractionMode } from "./interactionModes";

export default class HelpCommand extends BaseCommand {
  constructor(commands) {
    super(
      "Displays this message. Get additional help by doing help <command>."
    );
    this.commands = {
      // add self on top
      help: this,
      ...commands
    };
  }

  execute(commandOptions) {
    const args = commandOptions.args;
    switch (commandOptions.mode) {
      case InteractionMode.CLI:
        return this.cliExecute(args);
      case InteractionMode.DISCORD:
        return this.discordExecute(args);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  cliExecute(args) {
    if (args[0]) {
      console.log(this.getCommandHelpDisplay(args[0]));
    } else {
      console.log(this.getMainHelpDisplay());
    }
  }

  getMainHelpDisplay() {
    var commandDescriptions = "";

    const commandKeys = Object.keys(this.commands);
    for (const commandKey of commandKeys) {
      commandDescriptions += this.describeCommand(commandKey);
      commandDescriptions += "\n";
    }

    var header = "Usage:\n";
    header += "<command> playerName... [options]\n\n";
    header += "Available commands are:";

    var helpMessage = header + "\n" + commandDescriptions;
    return helpMessage;
  }

  getCommandHelpDisplay(commandName) {
    const commandEntry = this.commands[commandName];
    if (!commandEntry) {
      return (
        `${commandName} is not a valid command.\n` + this.getMainHelpDisplay()
      );
    }

    const commandInfo = this.describeCommand(commandName);
    const options = commandEntry.commandOptions();
    if (!options) {
      return commandInfo + "\n\nThis command has no options.";
    } else {
      return commandInfo + "\n\nOptions for this command are:\n" + options;
    }
  }

  describeCommand(commandName) {
    const commandEntry = this.commands[commandName];
    const formatted = commandName + ":\n  " + commandEntry.description;
    return formatted;
  }

  discordExecute(args) {
    var messageContent;
    if (args[0]) {
      messageContent = this.getCommandHelpDisplay(args[0]);
    } else {
      messageContent = this.getMainHelpDisplay();
    }

    return { message: "```" + messageContent + "```" };
  }
}
