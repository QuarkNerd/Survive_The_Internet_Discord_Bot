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
  num_rounds: number;


  constructor() {
      this.num_rounds = 5;
  }

  start(players: Discord.User[]) {
    players.forEach((play) => {
      this.players[play.id] = {
        botUser: play,
        score: 0,
      };
    });

    
  }
}

export default Game;
