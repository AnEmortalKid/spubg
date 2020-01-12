import fs from "fs";
import path from "path";
import { checkFileExists } from "./testUtils";

export function expectFileExists(...pathSegments) {
  checkFileExists(path.resolve(...pathSegments)).then(value =>
    expect(value).toBe(true)
  );
}

export function expectFileMissing(...pathSegments) {
  checkFileExists(path.resolve(...pathSegments)).then(value =>
    expect(value).toBe(false)
  );
}
