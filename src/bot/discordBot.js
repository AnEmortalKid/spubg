var Discord = require("discord.io");
var logger = require("winston");

import { execute } from "../commands/executor";
import { InteractionMode } from "../commands/interactionModes";

require("dotenv").config();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";

// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.DISCORD_TOKEN,
  autorun: true
});

bot.on("ready", function(evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, evt) {
  // listen on $pubg

  if (message.substring(0, 5) == "$pubg") {
    // $pubg command args
    var messageParts = message.split(" ");
    var cmd = messageParts[1];
    const cmdArgs = messageParts.splice(2);

    // TODO argparse

    switch (cmd) {
      // !ping
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "hello!"
        });
        break;
      default:
        execute(cmd, {
          mode: InteractionMode.DISCORD,
          args: cmdArgs
        }).then(response => {
          console.log(response);

          response.to = channelID;
          bot.sendMessage(response);
        });

      // TODO deal with embeds
    }
  }
});
