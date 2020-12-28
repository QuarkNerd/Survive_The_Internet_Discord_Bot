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
  main_channel: Discord.TextChannel;

  constructor(main_channel: Discord.TextChannel) {
    this.rounds = get_subsection_random_order(possibleRounds, 5);
    this.main_channel = main_channel;
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
    this.main_channel.send(`Round ${num + 1}: ${round.Name}`);
    // get random order of ids,

    // put in array of objects,

    //PARET ONE
    //for each elelemnt choose coorect prompt, send and make mesage collector
    // do verifcation within each collector seperatl;ey
    // At end return with object comntating id and twistee words (default or not)

    //pRT two
    // pass to twister, do the same
    //Part one and two can probably share a function
    // end up with an array of plays// send overl
    // then send voting options to each player // When playtesting discuss how to improve this
  }
}

export default Game;
