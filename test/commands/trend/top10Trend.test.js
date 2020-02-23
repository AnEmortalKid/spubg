import Top10TrendCommand from "../../../src/commands/trends/top10Trend";
import { InteractionMode } from "../../../src/commands/interactionModes";
import { expectFileExists, expectFileMissing } from "../../util/fileExpect";
import { removeDirectory } from "../../util/testUtils";

import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../../src/stats/statsAPI";

const mockLifetimeTrend = jest.fn();

jest.mock("../../../src/stats/statsAPI", () => {
  const original = require.requireActual("../../../src/stats/statsAPI");
  return {
    ...original,
    supportedGameModes: ["game-mode-one", "game-mode-two"],
    getSeasonAndLifetimeTrend: () => mockLifetimeTrend()
  };
});

// data for all tests
const seasonAndLifetimeData = {
  seasonal: [
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
  ],
  lifetime: {
    "game-mode-one": {
      adr: "200.00",
      kd: "3.75",
      winRate: "10.00",
      mostKills: 14,
      top10Rate: "50.00"
    },
    "game-mode-two": {
      adr: "400.00",
      kd: "4.00",
      winRate: "15.00",
      mostKills: 15,
      top10Rate: "50.00"
    }
  }
};

beforeAll(() => {
  removeDirectory("temp/", "charts/", "trend/");
});

const command = new Top10TrendCommand();

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
    expect(command.description).toBe("Charts Top 10 Rate by season.");
  });

  it("has a modes option", () => {
    const commandOptions = command.commandOptions(InteractionMode.CLI);

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
  it("defaults to squad-fpp for discord mode and supports a single mode", () => {
    const commandOptions = command.commandOptions(InteractionMode.DISCORD);
    expect(commandOptions).toEqual(
      expect.stringContaining(
        "--modes the set of game modes to generate a trend chart for, only supports a single mode."
      )
    );
    expect(commandOptions).toEqual(
      expect.stringContaining('By default the game mode is "squad-fpp".')
    );
    expect(commandOptions).toEqual(
      expect.stringContaining("ex: --modes duo-fpp")
    );
  });
});

describe("cliMode", () => {
  it("executes for all modes", async () => {
    mockLifetimeTrend.mockReturnValue(seasonAndLifetimeData);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["topTen_playerOne"],
      options: {}
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 50);
    });

    // pattern playerName-attribute-mode
    const expectedNames = [
      "topTen_playerOne-TopTen-game-mode-one.png",
      "topTen_playerOne-TopTen-game-mode-one.svg",
      "topTen_playerOne-TopTen-game-mode-two.png",
      "topTen_playerOne-TopTen-game-mode-two.svg"
    ];

    for (const expectedName of expectedNames) {
      expectFileExists("temp/", "charts/", "trend/", expectedName);
    }
  });

  it("executes only for the filtered mode", async () => {
    mockLifetimeTrend.mockReturnValue(seasonAndLifetimeData);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["topTen_playerTwo"],
      options: {
        modes: ["game-mode-two"]
      }
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 50);
    });

    // pattern playerName-attribute-mode
    const expectedExist = [
      "topTen_playerTwo-TopTen-game-mode-two.png",
      "topTen_playerTwo-TopTen-game-mode-two.svg"
    ];

    for (const expectedName of expectedExist) {
      expectFileExists("temp/", "charts/", "trend/", expectedName);
    }

    const expectedMissing = [
      "topTen_playerTwo-TopTen-game-mode-one.png",
      "topTen_playerTwo-TopTen-game-mode-one.svg"
    ];

    for (const expectedName of expectedMissing) {
      expectFileMissing("temp/", "charts/", "trend/", expectedName);
    }
  });
});
