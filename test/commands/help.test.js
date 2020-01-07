import HelpCommand from "../../src/commands/help";
import { getCommands, InteractionMode } from "../../src/commands/executor";

const command = new HelpCommand();

jest.mock("../../src/commands/executor", () => {
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

  const original = require.requireActual("../../src/commands/executor");
  return {
    ...original, //Pass down all the exported objects
    getCommands: jest.fn(() => fakeCommands)
  };
});

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

  // assert commands are listed with their description
  expect(helpMesage).toEqual(expect.stringContaining("bar:"));
  expect(helpMesage).toEqual(
    expect.stringContaining("the description for the bar command")
  );
  expect(helpMesage).toEqual(expect.stringContaining("optiony:"));
  expect(helpMesage).toEqual(expect.stringContaining("a command with options"));
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
      "displays this message. Get additional help by doing help <command>."
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
