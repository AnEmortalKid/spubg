import { get } from "../../src/seasons/seasonsAPI";

const mockCache = {
  getAll: jest.fn(),
  store: jest.fn()
};

const mockClient = {
  seasons: jest.fn()
};

const seasons = get(mockCache, mockClient);

describe("getAll", () => {
  it("uses the cached value if it exists", () => {
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

    const returnedSeasons = seasons.getAll();
    expect(returnedSeasons).resolves.toBe(seasonData);
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
});
