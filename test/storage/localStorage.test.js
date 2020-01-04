import { getLocalDBPath } from "../../src/config/env";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import LocalStorage from "../../src/storage/localStorage";

jest.mock("../../src/config/env", () => ({
  getLocalDBPath: () => "temp/testdb.json"
}));

var dbInstance;
beforeAll(() => {});

beforeEach(() => {
  // reset state
  const adapter = new FileSync(getLocalDBPath());
  dbInstance = low(adapter);
  dbInstance.set("players", []).write();
});

describe("get", () => {
  it("returns value in the desired collection", () => {
    const players = [
      {
        id: "account.playerOne",
        name: "playerOne"
      }
    ];
    dbInstance.set("players", players).write();

    const storage = new LocalStorage(getLocalDBPath());
    const collection = storage.get("players");
    expect(collection).toEqual(players);
  });

  it("returns empty when the collection does not exist", () => {
    const storage = new LocalStorage(getLocalDBPath());
    const collection = storage.get("cats");
    expect(collection).toEqual([]);
  });
});

describe("store", () => {
  it("stores the desired values", () => {
    const storage = new LocalStorage(getLocalDBPath());
    storage.store("players", {
      id: "account.playerTwo",
      name: "playerTwo"
    });

    const stored = dbInstance.get("players").value();
    console.log(stored);
  });
});
