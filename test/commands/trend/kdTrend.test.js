import KDTrendCommand from "../../../src/commands/trends/kdtrend";
import { InteractionMode } from "../../../src/commands/interactionModes";

const command = new KDTrendCommand();

describe("unsupported mode", () => {
  it("throws an error when a mode is not supported", () => {
    const cmdOptions = {
      mode: "foo",
      args: ["bar"]
    };

    expect(() => {
      command.execute(cmdOptions);
    }).toThrowError("foo is not supported");
  });
});
