import { parseArguments } from "../../src/args/argParser";

describe("parseArguments", () => {
  it("handles multiple arguments", () => {
    const rawArgs = ["one", "two", "three"];

    const parsed = parseArguments(rawArgs);
    expect(parsed.args).toEqual(["one", "two", "three"]);
  });

  it("handles options", () => {
    const rawArgs = ["foo", "--bar", "baz", "glaz", "--char", "chaz"];

    const parsed = parseArguments(rawArgs);
    const options = parsed.options;

    expect(options.bar).toEqual(["baz", "glaz"]);
    expect(options.char).toEqual(["chaz"]);
  });
});
