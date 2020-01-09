import KDTrendCommand from "../../../src/commands/trends/kdtrend";
import { InteractionMode } from "../../../src/commands/interactionModes";

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

    mockLifetimeTrend.mockReturnValue(seasonAndLifetimeData);

    const cmdOptions = {
      mode: InteractionMode.CLI,
      args: ["playerOne"],
      options: {}
    };

    await command.execute(cmdOptions);

    // assert some stuff on files? at least created?
  });
});
