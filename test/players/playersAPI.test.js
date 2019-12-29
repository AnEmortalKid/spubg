import { get } from "../../src/players/playersAPI";

import { findPlayerId } from "../../src/api-client/pubgClient";

jest.mock("../../src/api-client/pubgClient", () => {
  return { findPlayerId: jest.fn() };
});

const mockGetId = jest.fn();
const mockStoreId = jest.fn();
const mockCache = {
  getId: mockGetId,
  storeId: mockStoreId
};

const players = get(mockCache);

describe("findId", () => {
  it("uses the cached value if it exists", () => {
    mockGetId.mockReturnValue("someId");
    const foundId = players.findId("somePlayer");
    expect(foundId).resolves.toBe("someId");
  });

  it("calls the client when the cache contains no values", () => {
    mockGetId.mockReturnValue(null);
    findPlayerId.mockReturnValue(Promise.resolve("retrievedId"));
    const foundId = players.findId("somePlayer");
    expect(foundId).resolves.toBe("retrievedId");
  });
});
