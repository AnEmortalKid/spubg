import { getLocalDBPath } from "../../src/config/env";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import LocalStorage from "../../src/storage/localStorage";

jest.mock("../../src/config/env", () => ({
  getLocalDBPath: () => "temp/testdb.json"
}));

var dbInstance;
beforeAll(() => {
  const adapter = new FileSync(getLocalDBPath());
  dbInstance = low(adapter);
});

describe("get", () => {
  it("returns value in the desired collection", () => {
    console.log(LocalStorage.get("players"));

    const players = [
      {
        id: "account.playerOne",
        name: "playerOne"
      }
    ];
    dbInstance.set("players", players).write();

    const collection = LocalStorage.get("players");
    console.log(collection);
    expect(collection).toEqual(players);
  });
});
