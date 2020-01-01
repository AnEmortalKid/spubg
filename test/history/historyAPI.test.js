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

describe("get", () => {
  it("fetches all data if nothing is in the cache", async () => {
    // setup player id
    mockPlayers.findId.mockReturnValue("someId");
    // setup seasons
    mockSeasons.getSearchableIds.mockReturnValue([
      "seasonOneId",
      "seasonTwoId"
    ]);
    // nothing stored
    mockCache.get.mockReturnValue(null);
    // setup client to return seasonOneData -> season2Data
    mockClient.playerSeason
      .mockReturnValue("seasonTwoData")
      .mockReturnValueOnce("seasonOneData");

    const somePlayerHist = await history.get("somePlayer");

    expect(somePlayerHist).toEqual({
      seasonOneId: "seasonOneData",
      seasonTwoId: "seasonTwoData"
    });

    // it should store the data
    expect(mockCache.store).toHaveBeenCalledWith("someId", {
      seasonOneId: "seasonOneData",
      seasonTwoId: "seasonTwoData"
    });
  });

  it("updates info for the latest season when history exists", async () => {
    // setup player id
    mockPlayers.findId.mockReturnValue("someId");
    // setup seasons
    mockSeasons.getSearchableIds.mockReturnValue(["latestSeason"]);
    mockSeasons.getLatestSeasonId.mockReturnValue("latestSeason");
    // setup cache
    mockCache.get.mockReturnValue({
      latestSeason: "staleSeasonData"
    });
    // setup client to return new data for the latest season
    mockClient.playerSeason.mockReturnValue("newSeasonData");

    const somePlayerHist = await history.get("somePlayer");

    expect(somePlayerHist).toEqual({
      latestSeason: "newSeasonData"
    });

    // it should store the updated data
    expect(mockCache.store).toHaveBeenCalledWith("someId", {
      latestSeason: "newSeasonData"
    });
  });

  it("finds older season data if the history did not store it", async () => {
    // setup player id
    mockPlayers.findId.mockReturnValue("someId");
    // setup seasons
    mockSeasons.getSearchableIds.mockReturnValue(["latestSeason", "pastSeason"]);
    mockSeasons.getLatestSeasonId.mockReturnValue("latestSeason");
    // setup cache
    mockCache.get.mockReturnValue({
      latestSeason: "staleSeasonData"
    });
    // setup client to return new data for the latest season
    // newSeasonData -> pastSeasonData
    mockClient.playerSeason.mockReturnValue("pastSeasonData").mockReturnValueOnce("newSeasonData");

    const somePlayerHist = await history.get("somePlayer");

    expect(somePlayerHist).toEqual({
      latestSeason: "newSeasonData",
      pastSeason: "pastSeasonData"
    });

    // it should store the updated data
    expect(mockCache.store).toHaveBeenCalledWith("someId", {
      latestSeason: "newSeasonData",
      pastSeason: "pastSeasonData"
    });
  });
});
