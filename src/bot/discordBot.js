const Discord = require("discord.js");
var logger = require("winston");

import { execute } from "../commands/executor";
import { InteractionMode } from "../commands/interactionModes";
import { parseArguments } from "../args/argParser";

require("dotenv").config();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";

// Initialize Discord Bot
const client = new Discord.Client();
client.once("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: " + client.user);
});

client.login(process.env.DISCORD_TOKEN);

client.on("message", message => {
  const content = message.content;

  if (content.substring(0, 5) == "$pubg") {
    // $pubg command args
    var messageParts = content.split(" ");
    var cmd = messageParts[1];
    const cmdArgs = messageParts.splice(2);
    const parsed = parseArguments(cmdArgs);

    switch (cmd) {
      // !ping
      case "ping":
        message.channel.send("pong");
        break;
      case "pretty":
        const file = new Discord.MessageAttachment("./out.png");

        const exampleEmbed = {
          title: "Some title",
          image: {
            url: "attachment://out.png"
          }
        };

        message.channel.send({ files: [file], embed: exampleEmbed });
        break;
      default:
        execute(cmd, {
          mode: InteractionMode.DISCORD,
          args: parsed.args,
          options: parsed.options
        }).then(response => {
          message.channel.send(response);
        });
    }
  }
});
