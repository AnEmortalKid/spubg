import { getCache } from "../../src/players/playerCache";

const mockStorage = {
  find: jest.fn(),
  store: jest.fn()
};

const playerCache = getCache(mockStorage);

describe("getId", () => {
  it("returns null when player not found", () => {
    mockStorage.find.mockReturnValueOnce(null);

    const foundId = playerCache.getId("someName");
    expect(foundId).toBeNull();
  });

  it("returns playerId when stored in cache", () => {
    mockStorage.find.mockReturnValueOnce({
      id: "account.someValue",
      name: "someName"
    });

    const foundId = playerCache.getId("someName");
    expect(foundId).toBe("account.someValue");
  });
});

describe("storeId", () => {
  it("stores the player on the storage", () => {
    playerCache.storeId("account.someId", "playerName");

    expect(mockStorage.store).toHaveBeenCalledWith("players", {
      id: "account.someId",
      name: "playerName"
    });
  });
});
