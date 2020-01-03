import { gatherStats } from "../../src/stats/statsAPI";

describe("gatherStats", () => {
  it("returns empty when roundsPlayed is 0", () => {
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
});
