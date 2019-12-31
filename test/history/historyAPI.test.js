import { get as players } from "../../src/players/playersAPI";
import { get as seasons } from "../../src/seasons/seasonsAPI";
import { getCache } from "../../src/history/historyCache";
import { playerSeason } from "../../src/api-client/pubgClient";

import { getHistory } from "../../src/history/historyAPI";

const mockPlayers = {
  findId: jest.fn()
};
jest.mock("../../src/players/playersAPI", () => ({
  get: () => mockPlayers
}));

const mockSeasons = {
  getSearchableIds: jest.fn(),
  getLatestSeasonId: jest.fn()
};
jest.mock("../../src/seasons/seasonsAPI", () => ({
  get: () => mockSeasons
}));

const mockCache = {
  get: jest.fn(),
  store: jest.fn()
};
jest.mock("../../src/history/historyCache", () => ({
  getCache: () => mockCache
}));

jest.mock("../../src/api-client/pubgClient", () => ({
  playerSeason: jest.fn()
}));

describe("mocking is up", () => {
  it("should slap", () => {
    mockPlayers.findId.mockReturnValue("someId");
    mockSeasons.getSearchableIds.mockReturnValue(["seasonId"]);
    mockCache.get.mockReturnValue(null);
    playerSeason.mockReturnValue("seasonData");

    const somePlayerHist = getHistory("somePlayer");

    expect(somePlayerHist).resolves.toEqual({
      seasonId: "seasonData"
    });
  });
});
