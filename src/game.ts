import Discord from "discord.js";

import Round, { Prompt, possibleRounds, Verification } from "./rounds";
import {
  get_subsection_random_order,
  get_random_element,
  react_in_order,
  send_a_countdown,
} from "./utilities";

interface Player {
  botUser: Discord.User;
  score: number;
}

interface Play {
  buffoonId: string;
  twisterId: string;
  promptId?: string; // be specific
  buffoonText?: string;
  twisterText?: string;
  votes?: number;
}

interface TextRequest {
  userId: string;
  user: Discord.User;
  prompt: Prompt;
}

const MAX_VOTES = 3; //TODO customiseable

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
    plays = await this.run_voting(plays, round);
    console.log(plays);
  }

  async run_part_one(plays: Play[], round: Round): Promise<Play[]> {
    // store prompt id in play
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

  async run_voting(plays: Play[], round: Round): Promise<Play[]> {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]; // this will be from a function

    const emojiToTwisterId: { [emoji: string]: string } = {};

    plays.forEach((x, i) => {
      const FAKE_ID = 0;
      const buffoonUsername = this.players[x.buffoonId].botUser.username;
      emojiToTwisterId[emojis[i]] = x.twisterId;
      setTimeout(
        () =>
          this.mainChannel.send(
            round.get_result(
              buffoonUsername,
              FAKE_ID,
              x.buffoonText as string, // improve this
              x.twisterText as string
            )
          ),
        i * 4000
      );
    });

    const msgTxt = plays
      .map(
        (x, i) =>
          `${emojis[i]} ${this.players[x.buffoonId].botUser.username}: ${
            x.buffoonText
          }`
      )
      .join("\n");

    const botEmojiReactPromises: Promise<null>[] = [];
    const collectorEndPromises: Promise<null>[] = [];
    const collectors: Discord.ReactionCollector[] = [];
    const twisterIdToVotes: { [id: string]: string[] } = {};

    for (let i = 0; i < plays.length; i++) {
      const x = plays[i];
      const sentMsg = await this.players[x.twisterId].botUser.send(msgTxt);
      const emojisAllowed = [...emojis];
      emojisAllowed.splice(i, 1);
      botEmojiReactPromises.push(react_in_order(sentMsg, emojisAllowed));

      const filter_reaction = (
        reaction: Discord.MessageReaction,
        user: Discord.User
      ) =>
        user.id === x.twisterId &&
        emojisAllowed.indexOf(reaction.emoji.name) != -1;

      const collector = sentMsg.createReactionCollector(filter_reaction, {
        time: 100000,
      });
      collectors.push(collector);

      let voteCount: number = 0;
      collector.on("collect", (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        voteCount += 1;
        if (!twisterIdToVotes[emojiToTwisterId[reaction.emoji.name]]) {
          twisterIdToVotes[emojiToTwisterId[reaction.emoji.name]] = [];
        }
        twisterIdToVotes[emojiToTwisterId[reaction.emoji.name]].push(
          x.twisterId
        );

        if (voteCount === MAX_VOTES) {
          collector.stop("User completed voting");
        }
      });

      let resolveCallback;
      const promise: Promise<null> = new Promise((res, _) => {
        resolveCallback = res;
      });
      collectorEndPromises.push(promise);

      collector.on("end", () => {
        resolveCallback(null);
      });
    }

    await Promise.all(botEmojiReactPromises);
    plays.forEach((x) =>
      send_a_countdown(this.players[x.twisterId].botUser, 30)
    );
    collectors.forEach((x) => x.resetTimer({ time: 35000 }));
    await Promise.all(collectorEndPromises);

    return plays.map((x) => ({
      ...x,
      votes: twisterIdToVotes[x.twisterId]
        ? twisterIdToVotes[x.twisterId].length
        : 0,
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

export default Game;
