import { get } from "../../src/players/playersAPI";

const mockCache = {
  getId: jest.fn(),
  storeId: jest.fn()
};

const mockClient = {
  findPlayerId: jest.fn()
};

const players = get(mockCache, mockClient);

describe("findId", () => {
  it("uses the cached value if it exists", () => {
    mockCache.getId.mockReturnValue("someId");

    const foundId = players.findId("somePlayer");
    expect(foundId).resolves.toBe("someId");
  });

  it("calls the client when the cache contains no values", async () => {
    mockCache.getId.mockReturnValue(null);
    mockClient.findPlayerId.mockResolvedValue("retrievedId");

    const foundId = await players.findId("somePlayer");
    expect(foundId).toBe("retrievedId");

    // we should store the value
    expect(mockCache.storeId).toHaveBeenCalledWith("retrievedId", "somePlayer");
  });
});
