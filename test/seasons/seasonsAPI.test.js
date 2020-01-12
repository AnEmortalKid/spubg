import { get } from "../../src/seasons/seasonsAPI";

const mockCache = {
  getAll: jest.fn(),
  store: jest.fn(),
  getSeasonsUpdatedAt: jest.fn(),
  storeSeasonsUpdatedAt: jest.fn()
};

const mockClient = {
  seasons: jest.fn()
};

const seasons = get(mockCache, mockClient);

// for seasonsUpdatedAt time checking
const today = new Date();
const todayEntry = {
  year: today.getFullYear(),
  month: today.getMonth(),
  day: today.getDate()
};

describe("getAll", () => {
  it("uses the cached value if it exists and seasons are up to date", async () => {
    const seasonData = [
      {
        id: "firstSeason",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "secondSeason",
        isCurrent: false,
        isOffSeason: false
      }
    ];
    mockCache.getAll.mockReturnValue(seasonData);

    // return an entry for today
    mockCache.getSeasonsUpdatedAt.mockReturnValue(todayEntry);

    const returnedSeasons = await seasons.getAll();
    expect(returnedSeasons).toBe(seasonData);

    // should not fall through
    expect(mockClient.seasons).not.toHaveBeenCalled();
    expect(mockCache.store).not.toHaveBeenCalled();
    expect(mockCache.getAll).toHaveBeenCalledTimes(1);
  });

  it("calls the client when the cache contains no values", async () => {
    const expectedSeasons = [
      {
        id: "firstSeason",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "thirdSeason",
        isCurrent: true,
        isOffSeason: false
      }
    ];

    // return null, then the stored state
    mockCache.getAll.mockReturnValue(expectedSeasons).mockReturnValueOnce(null);

    /**
     * api response
     * {
     *   "type": "string",
     *   "id": "string",
     *   "attributes": {
     *     "isCurrentSeason": true,
     *     "isOffseason": true
     *   }
     * }
     */
    const apiSeasonData = [
      {
        id: "firstSeason",
        attributes: {
          isCurrentSeason: false,
          isOffseason: false
        }
      },
      {
        id: "thirdSeason",
        attributes: {
          isCurrentSeason: true,
          isOffseason: false
        }
      }
    ];

    mockClient.seasons.mockResolvedValue(apiSeasonData);

    const foundSeasons = await seasons.getAll();
    expect(foundSeasons).toBe(expectedSeasons);

    // the transformed seasons should be stored
    expect(mockCache.store).toHaveBeenCalledWith("firstSeason", false, false);
    expect(mockCache.store).toHaveBeenCalledWith("thirdSeason", true, false);
    // should use the latest stored value
    expect(mockCache.getAll).toHaveBeenCalledTimes(2);
  });

  it("refetches season data if the last update time did not match today", async () => {
    const seasonData = [
      {
        id: "firstSeason",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "secondSeason",
        isCurrent: false,
        isOffSeason: false
      }
    ];

    mockCache.getAll.mockReturnValue(seasonData);
    mockCache.getSeasonsUpdatedAt.mockReturnValue({
      year: todayEntry.year,
      month: todayEntry.month,
      day: todayEntry.day - 1
    });

    // return an empty value to not cause errors
    mockClient.seasons.mockReturnValue([]);

    const returnedSeasons = await seasons.getAll();
    expect(returnedSeasons).toBe(seasonData);

    // should retrieve data again
    expect(mockClient.seasons).toHaveBeenCalled();
    expect(mockCache.getAll).toHaveBeenCalledTimes(2);
  });
});

describe("getSearchableIds", () => {
  it("returns the ids of seasons known to have data on the steam shard", () => {
    const seasonData = [
      {
        id: "division.bro.official.2018-05",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "division.bro.official.2018-06",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "knownSearchable",
        isCurrent: false,
        isOffSeason: false
      }
    ];
    mockCache.getAll.mockReturnValue(seasonData);

    // should filter out bad ids
    const seasonIds = seasons.getSearchableIds();
    expect(seasonIds).resolves.toEqual(
      expect.arrayContaining(["knownSearchable"])
    );
  });
});

describe("getLatestSeasonId", () => {
  it("returns the id of the current season", () => {
    const seasonData = [
      {
        id: "division.bro.official.2018-05",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "division.bro.official.2018-06",
        isCurrent: false,
        isOffSeason: false
      },
      {
        id: "currentSeason",
        isCurrent: true,
        isOffSeason: false
      }
    ];
    mockCache.getAll.mockReturnValue(seasonData);

    const latestSeason = seasons.getLatestSeasonId();
    expect(latestSeason).resolves.toBe("currentSeason");
  });

  it("returns null when the api fails", () => {
    mockCache.getAll.mockReturnValue(null);

    const latestSeason = seasons.getLatestSeasonId();
    expect(latestSeason).resolves.toBeNull();
  });
});

describe("shouldFetchSeasons", () => {
  it("should return true when nothing is stored", () => {
    mockCache.getSeasonsUpdatedAt.mockReturnValue(null);

    const shouldFetch = seasons.shouldFetchSeasons();
    expect(shouldFetch).toBe(true);

    // it should also store an entry
    expect(mockCache.storeSeasonsUpdatedAt).toHaveBeenCalledWith(todayEntry);
  });

  it("should return true when year does not match", () => {
    const previousEntry = {
      year: todayEntry.year - 1,
      month: todayEntry.month,
      day: todayEntry.day
    };
    mockCache.getSeasonsUpdatedAt.mockReturnValue(previousEntry);

    const shouldFetch = seasons.shouldFetchSeasons();
    expect(shouldFetch).toBe(true);

    // it should also store an entry
    expect(mockCache.storeSeasonsUpdatedAt).toHaveBeenCalledWith(todayEntry);
  });

  it("should return true when month does not match", () => {
    const previousEntry = {
      year: todayEntry.year,
      month: todayEntry.month - 1,
      day: todayEntry.day
    };
    mockCache.getSeasonsUpdatedAt.mockReturnValue(previousEntry);

    const shouldFetch = seasons.shouldFetchSeasons();
    expect(shouldFetch).toBe(true);

    // it should also store an entry
    expect(mockCache.storeSeasonsUpdatedAt).toHaveBeenCalledWith(todayEntry);
  });

  it("should return true when day does not match", () => {
    const previousEntry = {
      year: todayEntry.year,
      month: todayEntry.month,
      day: todayEntry.day - 1
    };
    mockCache.getSeasonsUpdatedAt.mockReturnValue(previousEntry);

    const shouldFetch = seasons.shouldFetchSeasons();
    expect(shouldFetch).toBe(true);

    // it should also store an entry
    expect(mockCache.storeSeasonsUpdatedAt).toHaveBeenCalledWith(todayEntry);
  });

  it("should return false when entry matches", () => {
    mockCache.getSeasonsUpdatedAt.mockReturnValue(todayEntry);

    const shouldFetch = seasons.shouldFetchSeasons();
    expect(shouldFetch).toBe(false);
  });
});
