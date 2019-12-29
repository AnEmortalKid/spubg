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

  it("calls the client when the cache contains no values", () => {
    mockCache.getId.mockReturnValue(null);
    mockClient.findPlayerId.mockReturnValue(Promise.resolve("retrievedId"));

    const foundId = players.findId("somePlayer");
    expect(foundId).resolves.toBe("retrievedId");
  });
});
