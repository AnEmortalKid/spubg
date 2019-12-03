import axios from "axios";

// TODO create client with token and pass that down instead
const instance = axios.create({
  baseURL: "https://api.pubg.com/shards/steam/",
  headers: {
    Accept: "application/vnd.api+json"
  }
});

export function findPlayer(playerName) {
  instance
    .get(`/players?filter[playerNames]=${playerName}`,
    {
        headers: {
            Authorization: `Bearer ${process.env.PUBG_TOKEN}`
        }
    })
    .then(function(response) {
      console.log(response);
      console.log(JSON.stringify(response.data))
    })
    .catch(function(error) {
      console.log(error);
    });
}
