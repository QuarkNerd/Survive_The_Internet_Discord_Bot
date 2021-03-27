import Discord from "discord.js";
import DotEnv from "dotenv";

import {
  get_joining_message,
  get_leaving_message,
  helpMessage,
} from "./messages";
import { react_in_order, log } from "./utilities";
import Game from "./game";

const SIGN_UP_TIME_LIMIT = 60;

DotEnv.config();
const TOKEN = process.env.TOKEN;
const BOT: Discord.Client = new Discord.Client();

enum SignUpEnd {
  GameStarted = "start",
  Cancelled = "cancel",
  Time = "time",
}

const games: { [textId: string]: Game } = {};
let players: Discord.User[] = [];

BOT.login(TOKEN);

BOT.on("ready", () => {
  log(["BOT_LOGIN", `Logged in as ${BOT.user?.tag}!`]);
});

BOT.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "text") {
    handle_text_channel_msg(msg);
  }
});

function handle_text_channel_msg(m: Discord.Message) {
  log([
    "MESSAGE",
    `Collected ${m.content}, from ${m.author.username} in ${m.channel.id}`,
  ]);
  if (!m.content.startsWith("!survive ")) return;
  const command = m.content.split(" ");

  switch (command[1]) {
    case "ng":
      new_game_command(m, command.length > 2 ? command[2] : "");
      break;
    case "end":
      end_game_command(m);
      break;
    case "help":
      help_command(m);
      break;
  }
}

async function new_game_command(
  msg: Discord.Message,
  customisation: string
): Promise<any> {
  if (games[msg.channel.id]) {
    msg.channel.send("I can't play multiple games at the same time");
    return;
  } else {
    const game = new Game(
      msg.channel as Discord.TextChannel,
      customisation,
      () => delete games[msg.channel.id]
    );
    games[msg.channel.id] = game;
    const letsGoMsg = await msg.channel.send(
      "Let's go. Like this message to play. Tick react to start. Cross react to cancel game"
    );

    const collector = letsGoMsg.createReactionCollector(
      filter_sign_up_reaction,
      {
        time: SIGN_UP_TIME_LIMIT * 1000,
        dispose: true,
      }
    );

    react_in_order(letsGoMsg, ["✔", "👍", "❌"]);
    collector.on("collect", (reaction, user) => {
      log([
        "SIGN_UP",
        msg.channel.id,
        `Collected ${reaction.emoji.name} from ${user.tag}`,
      ]);

      switch (reaction.emoji.name) {
        case "✔":
          if (players.length <= Game.maxPlayers) {
            collector.stop(SignUpEnd.GameStarted);
            break;
          }
          msg.channel.send(
            `Sorry, can't start the game. The maximum number of players is ${Game.maxPlayers}`
          );
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
      log([
        "SIGN_UP",
        msg.channel.id,
        `Collected removal of ${reaction.emoji.name} from ${user.tag}`,
      ]);

      if (reaction.emoji.name === "👍") {
        msg.channel.send(get_leaving_message(user.username));
        players = players.filter((u) => u.id !== user.id);
      }
    });

    collector.on("end", (_, reason) => {
      log(["SIGN_UP", msg.channel.id, "Collector ended ", reason]);
      switch (reason) {
        case SignUpEnd.GameStarted:
          msg.channel.send(
            "The game will start now. Make sure server members can DM you"
          );
          game?.play(players).catch((err: Error) => {
            log(["GAME_ERROR", "Error occurred", err.message]);
            msg.channel.send("An unexpected error occurred. Please try again");
            delete games[msg.channel.id];
          });
          break;
        case SignUpEnd.Cancelled:
          delete games[msg.channel.id];
          msg.channel.send(
            "The game was cancelled because someone clicked the ❌"
          );
          break;
        case SignUpEnd.Time:
          delete games[msg.channel.id];
          msg.channel.send("The game was cancelled because time ran out");
          break;
      }
    });
  }
}

function help_command(msg: Discord.Message) {
  msg.channel.send(helpMessage);
}

function end_game_command(msg: Discord.Message) {
  games[msg.channel.id].end_game_early();
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
