import { getCache } from "../../src/players/playerCache";

const mockStorageFind = jest.fn();
const mockStorage = {
  find: mockStorageFind
};

const playerCache = getCache(mockStorage);

describe("storeId", () => {
  it("returns null when player not found", () => {
    mockStorageFind.mockReturnValueOnce(null);
    const foundId = playerCache.getId("someName");
    expect(foundId).toBeNull();
  });

  it("returns playerId when stored in cache", () => {
    mockStorageFind.mockReturnValueOnce({
      id: "account.someValue",
      name: "someName"
    });
    const foundId = playerCache.getId("someName");
    expect(foundId).toBe("account.someValue");
  });
});
