import HelpCommand from "../../src/commands/help";

import { InteractionMode } from "../../src/commands/interactionModes";

const fakeCommands = {
  bar: {
    description: "the description for the bar command",
    commandOptions: () => ""
  },
  optiony: {
    description: "a command with options",
    commandOptions: () => "-a the all option"
  }
};

const command = new HelpCommand(fakeCommands);

var outputData = "";

beforeEach(() => {
  outputData = "";
  console["log"] = jest.fn(inputs => (outputData += inputs));
});

afterEach(() => {
  console["log"].mockRestore();
});

/**
 * Validates that the help message captured contains all the expected parts
 */
function validateHelpMessage(helpMesage) {
  // should display a consistent header
  const expectedHeaderParts = [
    "Usage:\n",
    "<command> playerName... [options]\n\n",
    "Available commands are:"
  ];

  for (const headerPart of expectedHeaderParts) {
    expect(helpMesage).toEqual(expect.stringContaining(headerPart));
  }

  // should include the help message
  expect(helpMesage).toEqual(
    expect.stringContaining(
      "help:\n  Displays this message. Get additional help by doing help <command>."
    )
  );

  // assert commands are listed with their description
  expect(helpMesage).toEqual(expect.stringContaining("bar:"));
  expect(helpMesage).toEqual(
    expect.stringContaining("the description for the bar command")
  );
  expect(helpMesage).toEqual(expect.stringContaining("optiony:"));
  expect(helpMesage).toEqual(expect.stringContaining("a command with options"));
}

function validateIsInACodeBlock(message) {
  // should also surround the message in backticks
  const startTicks = message.substring(0, 3);
  const endTicks = message.substring(message.length - 3);

  expect(startTicks).toEqual("```");
  expect(endTicks).toEqual("```");
}

describe("unsupported mode", () => {
  it("throws an error when a mode is not supported", () => {
    const cmdOptions = {
      mode: "foo",
      args: ["bar"]
    };

    expect(() => {
      command.execute(cmdOptions);
    }).toThrowError("foo is not supported");
  });
});

describe("command properties", () => {
  it("returns the expected description", () => {
    expect(command.description).toBe(
      "Displays this message. Get additional help by doing help <command>."
    );
  });

  it("has no options", () => {
    expect(command.commandOptions()).toBeNull();
  });
});

describe("cliMode", () => {
  it("lists commands when no args are given", () => {
    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: []
    };

    command.execute(cmdOptions);

    validateHelpMessage(outputData);
  });

  it("indicates that the command is invalid when help for an unkown command is requested", () => {
    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["foo"]
    };

    command.execute(cmdOptions);

    expect(outputData).toEqual(
      expect.stringContaining("foo is not a valid command.\n")
    );
    // should list the generic help message as well
    validateHelpMessage(outputData);
  });

  it("indicates that a command has no options when help is requested for the command", () => {
    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["bar"]
    };

    command.execute(cmdOptions);

    expect(outputData).toEqual(
      expect.stringContaining("This command has no options.")
    );
  });

  it("indicates options when help is requested for a command with options", () => {
    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["optiony"]
    };

    command.execute(cmdOptions);

    expect(outputData).toEqual(
      expect.stringContaining("Options for this command are:\n")
    );
    expect(outputData).toEqual(expect.stringContaining("-a the all option"));
  });
});

describe("discord mode", () => {
  it("lists commands when no args are given", () => {
    const cmdOptions = {
      mode: InteractionMode.DISCORD,
      args: []
    };

    const response = command.execute(cmdOptions);

    validateHelpMessage(response.message);
    validateIsInACodeBlock(response.message);
  });

  it("indicates that the command is invalid when help for an unkown command is requested", () => {
    const cmdOptions = {
      mode: InteractionMode.DISCORD,
      args: ["foo"]
    };

    const response = command.execute(cmdOptions);

    expect(response.message).toEqual(
      expect.stringContaining("foo is not a valid command.\n")
    );
    // should list the generic help message as well
    validateHelpMessage(response.message);

    validateIsInACodeBlock(response.message);
  });

  it("indicates that a command has no options when help is requested for the command", () => {
    const cmdOptions = {
      mode: InteractionMode.DISCORD,
      args: ["bar"]
    };

    const response = command.execute(cmdOptions);

    expect(response.message).toEqual(
      expect.stringContaining("This command has no options.")
    );

    validateIsInACodeBlock(response.message);
  });

  it("indicates options when help is requested for a command with options", () => {
    const cmdOptions = {
      mode: InteractionMode.DISCORD,
      args: ["optiony"]
    };

    const response = command.execute(cmdOptions);

    expect(response.message).toEqual(
      expect.stringContaining("Options for this command are:\n")
    );
    expect(response.message).toEqual(
      expect.stringContaining("-a the all option")
    );

    validateIsInACodeBlock(response.message);
  });
});
