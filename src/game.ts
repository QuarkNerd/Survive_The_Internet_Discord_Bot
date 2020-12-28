import Discord from "discord.js";
import DotEnv from "dotenv";

import Round, { possibleRounds } from "./rounds";
import { get_subsection_random_order } from "./utilities";

interface Player {
  botUser: Discord.User;
  score: number;
}

interface Play {
  buffoonId: string;
  twisterId: string;
  buffoonText?: string;
}

class Game {
  players: {
    [userId: string]: Player;
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

  async play() {
    for (let i = 0; i < this.rounds.length; i++) {
      await this.run_round(this.rounds[i], i);
    }
  }

  async run_round(round: Round, num: number) {
    this.mainChannel.send(`Round ${num + 1}: ${round.name}`);
    let playerIds = Object.keys(this.players);
    let plays: Play[] = get_subsection_random_order(
      playerIds,
      playerIds.length
    ).map((x, i, arr) => {
      return {
        buffoonId: x,
        twisterId: arr[(i + 1) % arr.length],
      };
    });

    plays = await this.run_part_one(plays, round);
    console.log(plays);

    //pRT two
    // pass to twister, do the same
    //Part one and two can probably share a function
    // end up with an array of plays// send overl
    // then send voting options to each player // When playtesting discuss how to improve this
  }

  run_part_one(plays: Play[], round: Round): Promise<Play[]> {
    let resolveCallback;
    let completedPlays: Play[] = [];
    const onPlayComplete = (play: Play) => {
      completedPlays.push(play);

      if (completedPlays.length === plays.length) {
        resolveCallback(completedPlays);
      }
    };

    let promptList = round.get_buffoon_prompts(plays.length);

    plays.forEach(async (pl, i) => {
      let prompt = promptList[i];
      let player = this.players[pl.buffoonId].botUser;
      let responseReceived = false;

      let dmChannel = player.dmChannel
        ? player.dmChannel
        : await player.createDM();

      const filter = (m: Discord.Message) => m.author.id === pl.buffoonId;
      const collector = dmChannel.createMessageCollector(filter, {
        time: 60000,
      });
      player.send(prompt.prompt);
      collector?.on("collect", (m: Discord.Message) => {
        console.log(`Collected ${m.content}, from ${player.username}`);

        if (!responseReceived) {
          const verification = round.verify_buffoon_text(prompt.id, m.content);

          if (verification.valid) {
            onPlayComplete({
              ...pl,
              buffoonText: m.content,
            });
            m.react("✔️");
            responseReceived = true;
          } else {
            m.react("❌");
            player.send(verification.detail);
          }
        }
      });

      collector?.on("end", (_) => {
        if (!responseReceived) {
          onPlayComplete({
            ...pl,
            buffoonText: prompt.default,
          });
        }
      });

      if (!collector) {
        console.error(
          `collector is undefined, and playerId is ${player.username}`
        );
      }
    });

    return new Promise((res, _) => {
      resolveCallback = res;
    });
  }
}

export default Game;
