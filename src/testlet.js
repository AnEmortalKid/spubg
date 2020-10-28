import { getClient } from "./api-client/client";

var id = "account.d383c1d18f094583bf33a495179280c6";

function findWinningRoster(included) {
  return included.find(
    item => item.type == "roster" && item.attributes.won == "true"
  );
}

function findParticipants(included) {
  var participants = new Map();

  included.forEach(item => {
    if (item.type == "participant") {
      participants.set(item.id, {
        name: item.attributes.stats.name,
        id: item.attributes.stats.playerId
      });
    }
  });

  return participants;
}

function participantToPlayer(included) {
  var participants = new Map();

  included.forEach(item => {
    if (item.type == "participant") {
      participants.set(item.id, item.attributes.stats.playerId);
    }
  });

  return participants;
}

function findWinningPlayers(matchData) {
  var winners = findWinningRoster(matchData.included);
  var participantMap = participantToPlayer(matchData.included);
  var rosterMembers = winners.relationships.participants.data;

  var playerIds = [];
  rosterMembers.forEach(member => {
    playerIds.push(participantMap.get(member.id));
  });
  return playerIds;
}

function wonMatch(playerId, matchData) {
  return findWinningPlayers(matchData).includes(playerId);
}

getClient()
  .lifetimeStats(id)
  .then(data => {
    var matches = data.relationships.matchesSquadFPP.data;
    matches.forEach(match => {
        console.log(`Inspecting ${match.id}`);
      getClient()
        .match(match.id)
        .then(matchData => {
          if (wonMatch(id, matchData)) {
            console.log(`  Won match: ` + match.id);
          }
        });
    });
  console.log("Done!");
});
