import { getCache } from "../../src/history/historyCache";
import { interpolate } from "d3";

const mockStorage = {
  store: jest.fn(),
  find: jest.fn()
};

const historyCache = getCache(mockStorage);

describe("get", () => {
  it("returns null when nothing is stored", () => {
    mockStorage.find.mockReturnValue(null);

    const history = historyCache.get("somePlayerId");
    expect(history).toBeNull();
  });

  it("returns season data when something is stored", () => {
    const storedHistory = {
      id: "somePlayerId",
      seasonData: {
        theData: "foo"
      }
    };
    mockStorage.find.mockReturnValue(storedHistory);

    const history = historyCache.get("somePlayerId");
    expect(history).toEqual({
      theData: "foo"
    });
  });
});

describe("store", () => {
  it("stores the season history on the storage", () => {
    historyCache.store("somePlayerId", {
      theData: "foo"
    });

    expect(mockStorage.store).toHaveBeenCalledWith("history", {
      id: "somePlayerId",
      seasonData: {
        theData: "foo"
      }
    });
  });
});
