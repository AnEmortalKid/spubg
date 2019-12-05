// TODO memcache / remote

let seasons = [
  "division.bro.official.pc-2018-01",
  "division.bro.official.pc-2018-02",
  "division.bro.official.pc-2018-03",
  "division.bro.official.pc-2018-04",
  "division.bro.official.pc-2018-05"
];

export function all() {
  // TODO seasons would come from a cache to avoid that hit to store all of em
  return seasons;
}
