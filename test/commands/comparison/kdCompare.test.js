import KDCompareCommand from "../../../src/commands/comparison/kdCompare";
import { InteractionMode } from "../../../src/commands/interactionModes";
import { expectFileExists, expectFileMissing } from "../../util/fileExpect";
import { removeDirectory } from "../../util/testUtils";

import {
  getSeasonHistory,
  supportedGameModes
} from "../../../src/stats/statsAPI";

const mockSeasonHistory = jest.fn();

jest.mock("../../../src/stats/statsAPI", () => {
  const original = require.requireActual("../../../src/stats/statsAPI");
  return {
    ...original,
    supportedGameModes: ["game-mode-one", "game-mode-two"],
    getSeasonHistory: () => mockSeasonHistory()
  };
});

// setup comparison between p1 and p2
const playerOneHistory = [
  {
    season1: {
      "game-mode-one": {
        adr: "150.00",
        kd: "3.00",
        winRate: "10.00",
        mostKills: 7,
        top10Rate: "40.00"
      },
      "game-mode-one": {
        adr: "400.00",
        kd: "4.00",
        winRate: "15.00",
        mostKills: 15,
        top10Rate: "50.00"
      }
    }
  }
];

const playerTwoHistory = [
  {
    season1: {
      "game-mode-one": {
        adr: "250.00",
        kd: "3.00",
        winRate: "10.00",
        mostKills: 7,
        top10Rate: "40.00"
      },
      "game-mode-one": {
        adr: "500.00",
        kd: "4.00",
        winRate: "15.00",
        mostKills: 15,
        top10Rate: "50.00"
      }
    }
  }
];

beforeEach(() => {
  removeDirectory("temp/", "charts/", "comparison/");
});

const command = new KDCompareCommand();

describe("unsupported mode", () => {
  it("throws an error when a mode is not supported", () => {
    const cmdOptions = {
      mode: "foo",
      args: ["bar"]
    };

    expect(command.execute(cmdOptions)).rejects.toThrow(
      new Error("foo is not supported")
    );
  });
});

describe("command properties", () => {
  it("returns the expected description", () => {
    expect(command.description).toBe(
      "Kill/Death Rate Comparison between players."
    );
  });

  it("has a modes option", () => {
    const commandOptions = command.commandOptions();

    expect(commandOptions).toEqual(
      expect.stringContaining(
        "--modes the set of game modes to generate a trend chart for."
      )
    );
    expect(commandOptions).toEqual(
      expect.stringContaining(
        'By default the game modes are "squad-fpp", "solo-fpp", "duo-fpp".'
      )
    );
    expect(commandOptions).toEqual(
      expect.stringContaining("ex: --modes squad-fpp duo-fpp")
    );
  });
});

describe("cliMode", () => {
  it("executes for all modes", async () => {
    mockSeasonHistory
      .mockReturnValueOnce(playerOneHistory)
      .mockReturnValueOnce(playerTwoHistory);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["playerOne", "playerTwo"],
      options: {}
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 100);
    });

    const expectedFiles = [
      "kd-playerOne-playerTwo-game-mode-one.png",
      "kd-playerOne-playerTwo-game-mode-one.svg",
      "kd-playerOne-playerTwo-game-mode-two.png",
      "kd-playerOne-playerTwo-game-mode-two.svg"
    ];

    for (const expectedName of expectedFiles) {
      expectFileExists("temp/", "charts/", "comparison/", expectedName);
    }
  });

  it("executes only for the filtered mode", async () => {
    mockSeasonHistory
      .mockReturnValueOnce(playerOneHistory)
      .mockReturnValueOnce(playerTwoHistory);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["playerOne", "playerTwo"],
      options: {
        modes: ["game-mode-two"]
      }
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 100);
    });

    const expectedFiles = [
      "kd-playerOne-playerTwo-game-mode-two.png",
      "kd-playerOne-playerTwo-game-mode-two.svg"
    ];

    for (const expectedName of expectedFiles) {
      expectFileExists("temp/", "charts/", "comparison/", expectedName);
    }

    const missingFiles = [
      "kd-playerOne-playerTwo-game-mode-one.png",
      "kd-playerOne-playerTwo-game-mode-one.svg"
    ];
    for (const expectedName of missingFiles) {
      expectFileMissing("temp/", "charts/", "comparison/", expectedName);
    }
  });
});
