import { styleSeasonId, styleGameMode } from "../../src/styling/styler";

describe("styleSeasonId", () => {
  it("returns the seasonId when no pretty name is known", () => {
    const pretty = styleSeasonId("someSeason");
    expect(pretty).toBe("someSeason");
  });

  test.each([
    ["division.bro.official.pc-2018-01", "Survival Season 1"],
    ["division.bro.official.pc-2018-02", "Survival Season 2"],
    ["division.bro.official.pc-2018-03", "Survival Season 3"],
    ["division.bro.official.pc-2018-04", "Survival Season 4"],
    ["division.bro.official.pc-2018-05", "Survival Season 5"],
    ["division.bro.official.pc-2018-06", "Survival Season 6"],
    ["division.bro.official.pc-2018-07", "Survival Season 7"]
  ])("returns a nice season name for %s", (seasonId, expected) => {
    const pretty = styleSeasonId(seasonId);
    expect(pretty).toBe(expected);
  });
});

describe("styleGameMode", () => {
  test.each([
    ["squad", "Squad"],
    ["squad-fpp", "Squad FPP"],
    ["solo", "Solo"],
    ["solo-fpp", "Solo FPP"],
    ["duo", "Duo"],
    ["duo-fpp", "Duo FPP"]
  ])("returns a nice for game mode %s", (gameMode, expected) => {
    const pretty = styleGameMode(gameMode);
    expect(pretty).toBe(expected);
  });
});
