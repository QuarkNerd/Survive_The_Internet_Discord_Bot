import Discord from "discord.js";
import DotEnv from "dotenv";

import Round, { Prompt, possibleRounds, Verification } from "./rounds";
import { get_subsection_random_order, get_random_element } from "./utilities";

interface Player {
  botUser: Discord.User;
  score: number;
}

interface Play {
  buffoonId: string;
  twisterId: string;
  buffoonText?: string;
  twisterText?: string;
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
    plays = await this.run_part_two(plays, round);
    console.log(plays);
  }

  async run_part_one(plays: Play[], round: Round): Promise<Play[]> {
    const textRequestList: TextRequest[] = plays.map((x) => ({
      userId: x.buffoonId,
      user: this.players[x.buffoonId].botUser,
      prompt: get_random_element(round.possible_buffoon_prompts),
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

  async run_part_two(plays: Play[], round: Round): Promise<Play[]> {
    const textRequestList: TextRequest[] = plays.map((play, i) => ({
      userId: play.twisterId,
      user: this.players[play.twisterId].botUser,
      prompt: {
        id: i,
        prompt: `${play.buffoonText}\n\n\n${round.twisterPrompt}`,
        default: get_random_element(round.possible_filler_twister_texts),
      },
    }));

    const texts = await this.run_part(
      textRequestList,
      (_: number, text: string) => round.verify_twister_text(text)
    );

    return plays.map((x) => ({
      ...x,
      twisterText: texts[x.twisterId],
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
        time: 65000,
      });
      user.send(textReq.prompt.prompt);
      send_a_countdown(user, 60);
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

async function send_a_countdown(user: Discord.User, time: number) {
  let timeLeft = time;
  const secondsInterval = 5;
  const msg = await user.send(`Time left: ${timeLeft}s`);
  const interval = setInterval(() => {
    timeLeft = timeLeft - secondsInterval;
    msg.edit(`Time left: ${timeLeft}s`);
    if (timeLeft === 0) {
      clearInterval(interval);
      msg.delete();
    }
  }, secondsInterval * 1000);
}

export default Game;
