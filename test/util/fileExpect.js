import path from "path";
import { checkFileExists, checkFileExistsSync } from "./testUtils";

export function expectFileExists(...pathSegments) {
  checkFileExists(path.resolve(...pathSegments))
    .then(value => expect(value).toBe(true))
    .catch(error => {
      fail(error);
    });
}

export function expectFileExistsSync(...pathSegments) {
  expect(checkFileExistsSync(path.resolve(...pathSegments))).toBe(true);
}

export function expectFileMissing(...pathSegments) {
  checkFileExists(path.resolve(...pathSegments)).then(value =>
    expect(value).toBe(false)
  );
}

export function expectFileMissingSync(...pathSegments) {
  expect(checkFileExistsSync(path.resolve(...pathSegments))).toBe(false);
}
