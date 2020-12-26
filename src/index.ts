import Discord from "discord.js";
import DotEnv from "dotenv";

import { get_joining_message, get_leaving_message } from "./messages";

DotEnv.config();
const TOKEN = process.env.TOKEN;
const bot = new Discord.Client();

let game: any = null;
let players: {
  [user_id: string]: Discord.User;
};

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot?.user?.tag}!`);
});

bot.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type == "text") {
    handle_text_channel_msg(msg);
  } else if (msg.channel.type == "dm") {
    handle_dm(msg);
  }
});

function handle_dm(msg: Discord.Message): void {}

function handle_text_channel_msg(msg: Discord.Message) {
  console.log(msg.content);
  if (!msg.content.startsWith("!survive ")) return;
  const command = msg.content.split(" ");

  if (command[1] == "ng") {
    new_game_command(msg);
  }
}

async function new_game_command(msg: Discord.Message): Promise<any> {
  if (game) {
    msg.channel.send("I can't play multiple games at the same time");
    return;
  } else {
    game = 1;
    let message = await msg.channel.send("Let's go");
    await message.react("✔");
    await message.react("👍");
    await message.react("❌");

    const collector = message.createReactionCollector(filter_reaction, {
      time: 30000,
      dispose: true,
    });

    collector.on("collect", (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

      switch (reaction.emoji.name) {
        case "✔":
          collector.stop("Game started");
          break;
        case "👍":
          msg.channel.send(get_joining_message(user.username));
          players[user.id] = user;
          break;
        case "❌":
          collector.stop("Game cancelled");
          break;
      }
    });

    collector.on("remove", (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

      if (reaction.emoji.name === "👍") {
        msg.channel.send(get_leaving_message(user.username));
        delete players[user.id];
      }
    });
  }
}

function filter_reaction(reaction) {
  return (
    reaction.emoji.name === "👍" ||
    reaction.emoji.name === "✔" ||
    reaction.emoji.name === "❌"
  );
}
