// TODO write these

// import { getCache } from "../../src/seasons/seasonsCache";

// const mockStorage = {
//   store: jest.fn(),
//   get: jest.fn()
// };

// const seasonsCache = getCache(mockStorage);

// describe("getAll", () => {
//   it("returns empty when seasons not stored", () => {
//     mockStorage.get.mockReturnValueOnce([]);

//     const allSeasons = seasonsCache.getAll();
//     expect(allSeasons).toHaveLength(0);
//   });

//   it("returns seasons when something is stored", () => {
//     const seasons = [
//       {
//         id: "firstSeason",
//         isCurrent: false,
//         isOffSeason: false
//       },
//       {
//         id: "secondSeason",
//         isCurrent: false,
//         isOffSeason: false
//       }
//     ];

//     mockStorage.get.mockReturnValueOnce(seasons);

//     const allSeasons = seasonsCache.getAll();
//     expect(allSeasons).toBe(seasons);
//   });
// });

// describe("store", () => {
//   it("stores the season on the storage", () => {
//     seasonsCache.store("current-season", true, false);

//     expect(mockStorage.store).toHaveBeenCalledWith("seasons", {
//       id: "current-season",
//       isCurrent: true,
//       isOffSeason: false
//     });
//   });
// });
