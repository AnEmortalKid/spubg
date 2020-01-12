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
  db.set("seasonsUpdatedAt", {}).write();
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

describe("find", () => {
  it("returns null if the collection is empty", () => {
    const storage = new LocalStorage(getLocalDBPath());
    const stored = storage.find("players", {});

    expect(stored).toBeNull();
  });

  it("searches the collection based on search options", () => {
    const players = [
      {
        id: "account.playerOne",
        name: "playerOne"
      },
      {
        id: "account.playerTwo",
        name: "playerTwo"
      }
    ];

    const dbInstance = getDB();
    dbInstance.set("players", players).write();

    const storage = new LocalStorage(getLocalDBPath());

    const stored = storage.find("players", { id: "account.playerOne" });

    expect(stored).toEqual({ id: "account.playerOne", name: "playerOne" });
  });
});

describe("getValue", () => {
  it("returns null when nothing is associated", () => {
    const storage = new LocalStorage(getLocalDBPath());
    const stored = storage.getValue("someKey");

    expect(stored).toBeNull();
  });

  it("returns the stored value if something matches", () => {
    const dateEntry = {
      year: 2019,
      month: 10,
      day: 18
    };
    const dbInstance = getDB();
    dbInstance.set("seasonsUpdatedAt", dateEntry).write();

    const storage = new LocalStorage(getLocalDBPath());
    const storedEntry = storage.getValue("seasonsUpdatedAt");

    expect(storedEntry).toStrictEqual(dateEntry);
  });
});

describe("storeValue", () => {
  it("inserts the value when nothing was associated", () => {
    const dateEntry = {
      year: 2019,
      month: 10,
      day: 18
    };

    const storage = new LocalStorage(getLocalDBPath());
    storage.storeValue("seasonsUpdatedAt", dateEntry);

    const dbInstance = getDB();
    const stored = dbInstance.get("seasonsUpdatedAt").value();
    expect(stored).toStrictEqual(dateEntry);
  });

  it("replaces a value when something was previously associated", () => {
    const storage = new LocalStorage(getLocalDBPath());
    storage.storeValue("seasonsUpdatedAt", {
      year: 2019,
      month: 10,
      day: 18
    });

    storage.storeValue("seasonsUpdatedAt", {
      year: 2019,
      month: 11,
      day: 20
    });

    const dbInstance = getDB();
    const stored = dbInstance.get("seasonsUpdatedAt").value();
    expect(stored).toStrictEqual({
      year: 2019,
      month: 11,
      day: 20
    });
  });
});
