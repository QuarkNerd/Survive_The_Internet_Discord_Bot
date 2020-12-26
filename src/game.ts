import Discord from "discord.js";
import DotEnv from "dotenv";

interface Player {
  botUser: Discord.User;
  score: number;
}

class Game {
  players: {
    [user_id: string]: Player;
  } = {};

  constructor() {}

  start(players: Discord.User[]) {
    players.forEach((play) => {
      this.players[play.id] = {
        botUser: play,
        score: 0,
      };
    });

    console.log(this.players);
  }
}

export default Game;
