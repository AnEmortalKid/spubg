import { getCache } from "../../src/players/playerCache";

const mockFind = jest.fn();
const mockStore = jest.fn();
const mockStorage = {
  find: mockFind,
  store: mockStore
};

const playerCache = getCache(mockStorage);

describe("getId", () => {
  it("returns null when player not found", () => {
    mockFind.mockReturnValueOnce(null);
    const foundId = playerCache.getId("someName");
    expect(foundId).toBeNull();
  });

  it("returns playerId when stored in cache", () => {
    mockFind.mockReturnValueOnce({
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
    expect(mockStore).toHaveBeenCalledWith("players", {
      id: "account.someId",
      name: "playerName"
    });
  });
});
