import Discord from "discord.js";
import DotEnv from "dotenv";

import Round, { possibleRounds } from "./rounds";
import { get_subsection_random_order } from "./utilities";

interface Player {
  botUser: Discord.User;
  score: number;
}

class Game {
  players: {
    [user_id: string]: Player;
  } = {};
  rounds: Round[];
  mainChannel: Discord.TextChannel;

  constructor(mainChannel: Discord.TextChannel) {
    this.rounds = get_subsection_random_order(possibleRounds, 5);
    this.mainChannel = mainChannel;
  }

  start(players: Discord.User[]) {
    players.forEach((player) => {
      this.players[player.id] = {
        botUser: player,
        score: 0,
      };
    });

    this.play();
  }

  play() {
    this.rounds.forEach((x, i) => this.run_round(x, i));
  }

  run_round(round: Round, num: number) {
    this.mainChannel.send(`Round ${num + 1}: ${round.name}`);
    // get random order of ids,

    // put in array of objects,

    //PARET ONE
    //for each elelemnt choose coorect prompt, send and make mesage collector
    // do verifcation within each collector seperatl;ey
    // At end return with object comntating id and buffoon words (default or not)

    //pRT two
    // pass to twister, do the same
    //Part one and two can probably share a function
    // end up with an array of plays// send overl
    // then send voting options to each player // When playtesting discuss how to improve this
  }
}

export default Game;
