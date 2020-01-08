import {
  gatherStats,
  dataByGameMode,
  getSeasonHistory,
  getSeasonAndLifetimeTrend
} from "../../src/stats/statsAPI";

// imports that are mocked
import { get as history } from "../../src/history/historyAPI";
import { get as players } from "../../src/players/playersAPI";
import { getClient } from "../../src/api-client/client";

const mockHistory = {
  get: jest.fn()
};

jest.mock("../../src/history/historyAPI", () => {
  return {
    get: () => mockHistory
  };
});

const mockPlayers = {
  findId: jest.fn()
};

jest.mock("../../src/players/playersAPI", () => {
  return {
    get: () => mockPlayers
  };
});

const mockClient = {
  lifetimeStats: jest.fn()
};

jest.mock("../../src/api-client/client", () => {
  return {
    getClient: () => mockClient
  };
});

describe("gatherStats", () => {
  it("returns empty when roundsPlayed is 0 for all game modes", () => {
    const seasonData = {
      attributes: {
        gameModeStats: {
          "duo-fpp": {
            roundsPlayed: 0
          }
        }
      }
    };

    const gathered = gatherStats(seasonData);

    expect(gathered).toEqual({});
  });

  test.each([
    ["adr", "150.00"],
    ["kd", "3.00"],
    ["winRate", "10.00"],
    ["mostKills", 7],
    ["top10Rate", "40.00"]
  ])("computes %s stat", (attribute, expected) => {
    const seasonData = {
      attributes: {
        gameModeStats: {
          gameMode: {
            roundsPlayed: 10,
            damageDealt: 1500,
            losses: 3,
            kills: 9,
            wins: 1,
            roundMostKills: 7,
            top10s: 4
          }
        }
      }
    };

    const gathered = gatherStats(seasonData);
    const statContainer = gathered.gameMode;

    expect(statContainer[attribute]).toBe(expected);
  });

  it("returns kills when deaths is 0", () => {
    const seasonData = {
      attributes: {
        gameModeStats: {
          gameMode: {
            roundsPlayed: 1,
            damageDealt: 1700,
            losses: 0,
            kills: 10,
            wins: 1,
            roundMostKills: 10,
            top10s: 1
          }
        }
      }
    };

    const gathered = gatherStats(seasonData);
    const statContainer = gathered.gameMode;

    expect(statContainer.kd).toBe("10.00");
  });
});

describe("dataByGameMode", () => {
  it("places a 0 if no data exist for the attribute", () => {
    const seasonalStats = [
      {
        season1: {}
      }
    ];

    const data = dataByGameMode(["duo-fpp"], seasonalStats, "kd");

    const expected = {
      "duo-fpp": [
        {
          name: "season1",
          value: 0
        }
      ]
    };
    expect(data).toEqual(expected);
  });
  it("extracts data points by game mode", () => {
    const seasonalStats = [
      {
        season1: {
          "duo-fpp": {
            kd: 1.0
          }
        }
      },
      {
        season2: {
          "duo-fpp": {
            kd: 3.0
          }
        }
      }
    ];

    const data = dataByGameMode(["duo-fpp"], seasonalStats, "kd");

    const expected = {
      "duo-fpp": [
        {
          name: "season1",
          value: 1
        },
        {
          name: "season2",
          value: 3
        }
      ]
    };
    expect(data).toEqual(expected);
  });

  it("orders the data alphabetically", () => {
    const seasonalStats = [
      {
        seasonZ: {
          "duo-fpp": {
            kd: 1.0
          }
        }
      },
      {
        seasonA: {
          "duo-fpp": {
            kd: 3.0
          }
        }
      }
    ];

    const data = dataByGameMode(["duo-fpp"], seasonalStats, "kd");

    const expected = {
      "duo-fpp": [
        {
          name: "seasonA",
          value: 3
        },
        {
          name: "seasonZ",
          value: 1
        }
      ]
    };
    expect(data).toEqual(expected);
  });

  it("organizes by game mode", () => {
    const seasonalStats = [
      {
        season1: {
          "duo-fpp": {
            kd: 1.0
          },
          "squad-fpp": {
            kd: 2.0
          }
        }
      },
      {
        season2: {
          "duo-fpp": {
            kd: 3.0
          },
          "squad-fpp": {
            kd: 4.0
          }
        }
      }
    ];

    const data = dataByGameMode(["duo-fpp", "squad-fpp"], seasonalStats, "kd");

    const expected = {
      "duo-fpp": [
        {
          name: "season1",
          value: 1
        },
        {
          name: "season2",
          value: 3
        }
      ],
      "squad-fpp": [
        {
          name: "season1",
          value: 2
        },
        {
          name: "season2",
          value: 4
        }
      ]
    };
    expect(data).toEqual(expected);
  });
});

describe("getSeasonHistory", () => {
  it("returns statistics by season", () => {
    const seasonOneData = {
      attributes: {
        gameModeStats: {
          "game-mode-one": {
            roundsPlayed: 10,
            damageDealt: 1500,
            losses: 3,
            kills: 9,
            wins: 1,
            roundMostKills: 7,
            top10s: 4
          }
        }
      }
    };

    const seasonTwoData = {
      attributes: {
        gameModeStats: {
          "game-mode-one": {
            roundsPlayed: 20,
            damageDealt: 4000,
            losses: 8,
            kills: 30,
            wins: 2,
            roundMostKills: 14,
            top10s: 10
          }
        }
      }
    };

    const seasonalData = {
      season1: seasonOneData,
      season2: seasonTwoData
    };

    const expected = [
      {
        season1: {
          "game-mode-one": {
            adr: "150.00",
            kd: "3.00",
            winRate: "10.00",
            mostKills: 7,
            top10Rate: "40.00"
          }
        }
      },
      {
        season2: {
          "game-mode-one": {
            adr: "200.00",
            kd: "3.75",
            winRate: "10.00",
            mostKills: 14,
            top10Rate: "50.00"
          }
        }
      }
    ];

    mockHistory.get.mockReturnValue(seasonalData);

    const seasonHistory = getSeasonHistory("somePlayer");
    expect(seasonHistory).resolves.toEqual(expected);
  });
});

describe("getSeasonAndLifetimeTrend", () => {
  it("returns season history and lifetime info", () => {
    const seasonOneData = {
      attributes: {
        gameModeStats: {
          "game-mode-one": {
            roundsPlayed: 10,
            damageDealt: 1500,
            losses: 3,
            kills: 9,
            wins: 1,
            roundMostKills: 7,
            top10s: 4
          }
        }
      }
    };

    const seasonalData = {
      season1: seasonOneData
    };

    mockHistory.get.mockReturnValue(seasonalData);

    mockPlayers.findId.mockReturnValue("account.someId");

    const lifetimeResponseData = {
      attributes: {
        gameModeStats: {
          "game-mode-one": {
            roundsPlayed: 20,
            damageDealt: 4000,
            losses: 8,
            kills: 30,
            wins: 2,
            roundMostKills: 14,
            top10s: 10
          }
        }
      }
    };
    mockClient.lifetimeStats.mockReturnValue(lifetimeResponseData);

    const expected = {
      seasonal: [
        {
          season1: {
            "game-mode-one": {
              adr: "150.00",
              kd: "3.00",
              winRate: "10.00",
              mostKills: 7,
              top10Rate: "40.00"
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
        }
      }
    };

    const seasonAndLifetime = getSeasonAndLifetimeTrend("somePlayer");
    expect(seasonAndLifetime).resolves.toEqual(expected);
  });
});
