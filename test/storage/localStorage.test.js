import { getLocalDBPath } from "../../src/config/env";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import LocalStorage from "../../src/storage/localStorage";

jest.mock("../../src/config/env", () => ({
  getLocalDBPath: () => "temp/testdb.json"
}));

function getDB() {
  const adapter = new FileSync(getLocalDBPath());
  const dbInstance = low(adapter);
  return dbInstance;
}

function resetDB(db) {
  db.set("players", []).write();
}

beforeEach(() => {
  // reset the state
  resetDB(getDB());
});

describe("get", () => {
  it("returns value in the desired collection", () => {
    const players = [
      {
        id: "account.playerOne",
        name: "playerOne"
      }
    ];

    const dbInstance = getDB();
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

    const dbInstance = getDB();
    const stored = dbInstance.get("players").value();
    expect(stored).toEqual([
      {
        id: "account.playerTwo",
        name: "playerTwo"
      }
    ]);
  });

  it("replaces values if they have an id", () => {
    const storage = new LocalStorage(getLocalDBPath());
    storage.store("players", {
      id: "account.playerTwo",
      name: "playerTwo"
    });
    storage.store("players", {
      id: "account.playerTwo",
      name: "playerTwoAgain"
    });

    const dbInstance = getDB();
    const stored = dbInstance.get("players").value();
    expect(stored).toEqual([
      {
        id: "account.playerTwo",
        name: "playerTwoAgain"
      }
    ]);
  });
});
