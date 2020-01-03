import { gatherStats } from "../../src/stats/statsAPI";

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
});
