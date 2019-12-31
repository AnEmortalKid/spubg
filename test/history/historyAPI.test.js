import { get } from "../../src/history/historyAPI";

const mockPlayers = {
  findId: jest.fn()
};

const mockSeasons = {
  getSearchableIds: jest.fn(),
  getLatestSeasonId: jest.fn()
};

const mockCache = {
  get: jest.fn(),
  store: jest.fn()
};

const mockClient = {
  playerSeason: jest.fn()
};

const history = get({
  historyCache: mockCache,
  client: mockClient,
  players: mockPlayers,
  seasons: mockSeasons
});

describe("mocking is up", () => {
  it("should slap", () => {
    mockPlayers.findId.mockReturnValue("someId");
    mockSeasons.getSearchableIds.mockReturnValue(["seasonId"]);
    mockCache.get.mockReturnValue(null);
    mockClient.playerSeason.mockReturnValue("seasonData");

    const somePlayerHist = history.get("somePlayer");

    expect(somePlayerHist).resolves.toEqual({
      seasonId: "seasonData"
    });
  });
});
