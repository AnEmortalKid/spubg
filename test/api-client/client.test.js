import { getClient } from "../../src/api-client/client";

const mockAxios = {
  get: jest.fn()
};

const client = getClient(mockAxios);

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

    expect(client.findPlayerId("someName")).resolves.toStrictEqual("someId");
  });
});

describe("seasons", () => {
  it("finds seasons", () => {
    const mockResponse = {
      data: {
        // the actual api contents
        data: [
          {
            id: "seasonOne"
          },
          {
            id: "season2"
          }
        ]
      }
    };
    mockAxios.get.mockResolvedValue(mockResponse);

    expect(client.seasons()).resolves.toStrictEqual([
      {
        id: "seasonOne"
      },
      {
        id: "season2"
      }
    ]);
  });
});

describe("playerSeason", () => {
  it("finds season information for a player", () => {
    const mockResponse = {
      data: {
        // the actual api contents
        data: {
          attributes: "attributes"
        }
      }
    };
    mockAxios.get.mockResolvedValue(mockResponse);

    expect(client.playerSeason()).resolves.toStrictEqual({
      attributes: "attributes"
    });
  });
});

describe("lifetimeStats", () => {
  it("finds lifetime information for a player", () => {
    const mockResponse = {
      data: {
        // the actual api contents
        data: {
          attributes: "lifetimeAttributes"
        }
      }
    };
    mockAxios.get.mockResolvedValue(mockResponse);

    expect(client.lifetimeStats()).resolves.toStrictEqual({
      attributes: "lifetimeAttributes"
    });
  });
});
