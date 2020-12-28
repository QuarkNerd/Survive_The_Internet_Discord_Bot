import Discord from "discord.js";
import DotEnv from "dotenv";

import Round, { Prompt, possibleRounds, Verification } from "./rounds";
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

interface TextRequest {
  userId: string;
  user: Discord.User;
  prompt: Prompt;
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

  async run_part_one(plays: Play[], round: Round): Promise<Play[]> {
    const promptList = round.get_buffoon_prompts(plays.length);
    const textRequestList: TextRequest[] = promptList.map((x, i) => ({
      userId: plays[i].buffoonId,
      user: this.players[plays[i].buffoonId].botUser,
      prompt: x,
    }));

    const texts = await this.run_part(
      textRequestList,
      round.verify_buffoon_text
    );

    return plays.map((x) => ({
      ...x,
      buffoonText: texts[x.buffoonId],
    }));
  }

  run_part(
    textRequestList: TextRequest[],
    verify: (prompt_id: number, text: string) => Verification
  ): Promise<{ [userId: string]: string }> {
    let resolveCallback;
    let returnedText: { [userId: string]: string } = {};
    const onValidText = (userId: string, text: string) => {
      returnedText[userId] = text;

      if (Object.keys(returnedText).length === textRequestList.length) {
        resolveCallback(returnedText);
      }
    };

    textRequestList.forEach(async (textReq, i) => {
      const user = textReq.user;
      let responseReceived = false;

      let dmChannel = user.dmChannel ? user.dmChannel : await user.createDM();

      const filter = (m: Discord.Message) => m.author.id === textReq.userId;
      const collector = dmChannel.createMessageCollector(filter, {
        time: 60000,
      });
      user.send(textReq.prompt.prompt);
      collector?.on("collect", (m: Discord.Message) => {
        console.log(`Collected ${m.content}, from ${user.username}`);

        if (!responseReceived) {
          const verification = verify(textReq.prompt.id, m.content);

          if (verification.valid) {
            onValidText(textReq.userId, m.content);
            m.react("✔️");
            responseReceived = true;
          } else {
            m.react("❌");
            user.send(verification.detail);
          }
        }
      });

      collector?.on("end", (_) => {
        if (!responseReceived) {
          onValidText(textReq.userId, textReq.prompt.default);
        }
      });

      if (!collector) {
        console.error(
          `collector is undefined, and playerId is ${user.username}`
        );
      }
    });

    return new Promise((res, _) => {
      resolveCallback = res;
    });
  }
}

export default Game;
