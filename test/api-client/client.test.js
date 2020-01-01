import { getClient } from "../../src/api-client/client";

const mockAxios = {
  get: jest.fn()
};

const client = getClient(mockAxios);

// todo impl
describe("findPlayerId", () => {
  it("finds the player id by filtering by name", () => {
    const mockResponse = {
      data: {
        // the actual api contents
        data: [
          {
            id: "someId"
          }
        ]
      }
    };
    mockAxios.get.mockResolvedValue(mockResponse);

    expect(client.findPlayerId("someName")).resolves.toBe("someId");
  });
});
