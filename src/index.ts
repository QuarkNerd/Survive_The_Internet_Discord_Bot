import Discord from "discord.js";
import DotEnv from "dotenv";

import { get_joining_message, get_leaving_message } from "./messages";
import { react_in_order } from "./utilities";
import Game from "./game";

const SIGN_UP_TIME_LIMIT = 60;

DotEnv.config();
const TOKEN = process.env.TOKEN;
const BOT = new Discord.Client();

enum SignUpEnd {
  GameStarted = "start",
  Cancelled = "cancel",
  Time = "time",
}

let game: Game | null;
let players: Discord.User[] = [];

BOT.login(TOKEN);

BOT.on("ready", () => {
  console.info(`Logged in as ${BOT?.user?.tag}!`);
});

BOT.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type == "text") {
    handle_text_channel_msg(msg);
  } else if (msg.channel.type == "dm") {
    handle_dm(msg);
  }
});

function handle_dm(msg: Discord.Message): void {}

function handle_text_channel_msg(m: Discord.Message) {
  console.log(`Collected ${m.content}, from ${m.author.username}`);
  if (!m.content.startsWith("!survive ")) return;
  const command = m.content.split(" ");

  if (command[1] == "ng") {
    new_game_command(m);
  }
}

async function new_game_command(msg: Discord.Message): Promise<any> {
  if (game) {
    msg.channel.send("I can't play multiple games at the same time");
    return;
  } else {
    game = new Game(msg.channel as Discord.TextChannel);
    let letsGoMsg = await msg.channel.send("Let's go");

    const collector = letsGoMsg.createReactionCollector(
      filter_sign_up_reaction,
      {
        time: SIGN_UP_TIME_LIMIT * 1000,
        dispose: true,
      }
    );

    react_in_order(letsGoMsg, ["✔", "👍", "❌"]);
    collector.on("collect", (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

      switch (reaction.emoji.name) {
        case "✔":
          collector.stop(SignUpEnd.GameStarted);
          break;
        case "👍":
          msg.channel.send(get_joining_message(user.username));
          players.push(user);
          break;
        case "❌":
          collector.stop(SignUpEnd.Cancelled);
          break;
      }
    });

    collector.on("remove", (reaction, user) => {
      console.log(
        `Collected removal of ${reaction.emoji.name} from ${user.tag}`
      );

      if (reaction.emoji.name === "👍") {
        msg.channel.send(get_leaving_message(user.username));
        players = players.filter((u) => u.id !== user.id);
      }
    });

    collector.on("end", (_, reason) => {
      switch (reason) {
        case SignUpEnd.GameStarted:
          msg.channel.send(
            "The game will start now. Make sure server members can DM you"
          );
          game?.start(players);
          break;
        case SignUpEnd.Cancelled:
          game = null;
          msg.channel.send(
            "The game was cancelled because someone clicked the ❌"
          );
          break;
        case SignUpEnd.Time:
          game = null;
          msg.channel.send("The game was cancelled because time ran out");
          break;
        default:
          console.error("Unexpected reason to end collector: ", reason);
      }
    });
  }
}

function filter_sign_up_reaction(
  reaction: Discord.MessageReaction,
  user: Discord.User
) {
  return (
    !user.bot &&
    (reaction.emoji.name === "👍" ||
      reaction.emoji.name === "✔" ||
      reaction.emoji.name === "❌")
  );
}
