import KDTrendCommand from "../../../src/commands/trends/kdTrend";
import { InteractionMode } from "../../../src/commands/interactionModes";
import { expectFileExists, expectFileMissing } from "../../util/fileExpect";
import { removeDirectory } from "../../util/testUtils";

import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../../src/stats/statsAPI";

import { defaultDiscordChartMode } from "../../../src/commands/commandDefaults";

const mockLifetimeTrend = jest.fn();

jest.mock("../../../src/stats/statsAPI", () => {
  const original = require.requireActual("../../../src/stats/statsAPI");
  return {
    ...original,
    supportedGameModes: ["game-mode-one", "game-mode-two"],
    getSeasonAndLifetimeTrend: () => mockLifetimeTrend()
  };
});

jest.mock("../../../src/commands/commandDefaults", () => {
  const original = require.requireActual(
    "../../../src/commands/commandDefaults"
  );
  return {
    ...original,
    defaultDiscordChartMode: () => "game-mode-one"
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

const command = new KDTrendCommand();

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
    expect(command.description).toBe("Charts Kill/Death Rate by season.");
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
      args: ["kd_playerOne"],
      options: {}
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 50);
    });

    // pattern playerName-attribute-mode
    const expectedNames = [
      "kd_playerOne-KD-game-mode-one.png",
      "kd_playerOne-KD-game-mode-one.svg",
      "kd_playerOne-KD-game-mode-two.png",
      "kd_playerOne-KD-game-mode-two.svg"
    ];

    for (const expectedName of expectedNames) {
      expectFileExists("temp/", "charts/", "trend/", expectedName);
    }
  });

  it("executes only for the filtered mode", async () => {
    mockLifetimeTrend.mockReturnValue(seasonAndLifetimeData);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["kd_playerTwo"],
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
      "kd_playerTwo-KD-game-mode-two.png",
      "kd_playerTwo-KD-game-mode-two.svg"
    ];

    for (const expectedName of expectedExist) {
      expectFileExists("temp/", "charts/", "trend/", expectedName);
    }

    const expectedMissing = [
      "kd_playerTwo-KD-game-mode-one.png",
      "kd_playerTwo-KD-game-mode-one.svg"
    ];

    for (const expectedName of expectedMissing) {
      expectFileMissing("temp/", "charts/", "trend/", expectedName);
    }
  });
});

describe("discordMode", () => {
  it("executes for the default mode", async () => {
    mockLifetimeTrend.mockReturnValue(seasonAndLifetimeData);

    const cmdOptions = {
      mode: InteractionMode.DISCORD,
      args: ["kd_playerOne"],
      options: {}
    };

    await new Promise(r => {
      command.execute(cmdOptions);
      // wait a little bit to ensure files are done writing
      setTimeout(r, 50);
    });

    // pattern playerName-attribute-mode
    const expectedNames = [
      "kd_playerOne-KD-game-mode-one.png",
      "kd_playerOne-KD-game-mode-one.svg"
    ];

    for (const expectedName of expectedNames) {
      expectFileExists("temp/", "discord/", expectedName);
    }
  });
});
