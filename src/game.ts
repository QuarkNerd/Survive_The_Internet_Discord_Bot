import Discord from "discord.js";

import Round, { Prompt, possibleRounds, Verification } from "./rounds";
import {
  get_subsection_random_order,
  get_random_element,
  react_in_order,
  send_a_countdown,
  sleep,
  remove_emojis,
} from "./utilities";

interface Player {
  botUser: Discord.User;
  score: number;
  profileEmoji: string;
}

interface Play {
  buffoonId: string;
  twisterId: string;
  promptId?: string; // be specific
  buffoonText?: string;
  twisterText?: string;
  votes: string[];
}

interface TextRequest {
  userId: string;
  user: Discord.User;
  prompt: Prompt;
}

//TODO customiseable
const MAX_VOTES = 3;

const PART_ONE_TIME_LIMIT = 60;
const PART_TWO_TIME_LIMIT = 75;
const VOTING_TIME_LIMIT = 30;

const TWISTER_VOTE_SCORE = 100;
const BUFFOON_VOTE_SCORE = 20;
const MOST_VOTES_MULTIPLIER = 1.5;

class Game {
  players: {
    [userId: string]: Player;
  } = {};
  rounds: Round[];
  mainChannel: Discord.TextChannel;
  profileEmojiToId: {
    [emoji: string]: string;
  } = {};

  constructor(mainChannel: Discord.TextChannel) {
    this.rounds = get_subsection_random_order(possibleRounds, 9);
    this.mainChannel = mainChannel;
  }

  start(players: Discord.User[]) {
    const profileEmojiList = get_identity_emojis(players.length);

    players.forEach((player, i) => {
      this.players[player.id] = {
        botUser: player,
        score: 0,
        profileEmoji: profileEmojiList[i],
      };

      this.profileEmojiToId[profileEmojiList[i]] = player.id;
    });

    this.play();
  }

  async play() {
    for (let i = 0; i < this.rounds.length; i++) {
      await this.run_round(this.rounds[i], i);
    }
  }

  async run_round(round: Round, num: number) {
    // todo move these things into functions
    this.mainChannel.send(`Round ${num + 1}: ${round.name}`);
    let playerIds = Object.keys(this.players);
    let plays: Play[] = get_subsection_random_order(
      playerIds,
      playerIds.length
    ).map((x, i, arr) => {
      return {
        buffoonId: x,
        twisterId: arr[(i + 1) % arr.length],
        votes: [],
      };
    });

    plays = await this.run_part_one(plays, round);
    plays = await this.run_part_two(plays, round);
    await this.showcase_responses(plays, round);
    plays = await this.run_voting(plays);
    await this.display_round_results(plays);
    const scoreIncrease = this.get_score_increase(plays);
    this.update_score(scoreIncrease);
    await this.display_score(scoreIncrease);
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
      round.verify_buffoon_text,
      PART_ONE_TIME_LIMIT
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
        prompt: "```" + play.buffoonText + "```" + round.twisterPrompt,
        default: get_random_element(round.possible_filler_twister_texts),
      },
    }));

    const texts = await this.run_part(
      textRequestList,
      (_: number, text: string) => round.verify_twister_text(text),
      PART_TWO_TIME_LIMIT
    );

    return plays.map((x) => ({
      ...x,
      twisterText: texts[x.twisterId],
    }));
  }

  async showcase_responses(plays: Play[], round: Round) {
    this.mainChannel.send("Let's see what you have come up with!");
    await sleep(4000);
    for (let i = 0; i < plays.length; i++) {
      const x = plays[i];
      const FAKE_ID = 0;
      const buffoonUsername = this.players[x.buffoonId].botUser.username;
      await this.mainChannel.send(
        round.get_result(
          buffoonUsername,
          FAKE_ID,
          x.buffoonText as string,
          this.players[x.buffoonId].profileEmoji,
          x.twisterText as string
        )
      );
      await sleep(6000);
    }
  }

  async run_voting(plays: Play[]): Promise<Play[]> {
    const msgTxt = generate_combined_display(
      plays,
      CombinedDisplayType.Basic,
      this.players
    );

    const botEmojiReactPromises: Promise<null>[] = [];
    const collectorEndPromises: Promise<null>[] = [];
    const collectors: Discord.ReactionCollector[] = [];
    const buffoonIdToVotes: { [id: string]: string[] } = {};

    for (let i = 0; i < plays.length; i++) {
      const x = plays[i];
      const sentMsg = await this.players[x.twisterId].botUser.send(msgTxt);
      const emojisAllowed = Object.keys(this.profileEmojiToId);
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
        const voteBuffoonId = this.profileEmojiToId[reaction.emoji.name];
        if (!buffoonIdToVotes[voteBuffoonId]) {
          buffoonIdToVotes[voteBuffoonId] = [];
        }
        buffoonIdToVotes[voteBuffoonId].push(
          this.players[x.twisterId].profileEmoji
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
    const countdownMsgs = plays.map((x) =>
      send_a_countdown(this.players[x.twisterId].botUser, VOTING_TIME_LIMIT)
    );
    collectors.forEach((x) =>
      x.resetTimer({ time: (VOTING_TIME_LIMIT + 5) * 1000 })
    );
    await Promise.all(collectorEndPromises);
    countdownMsgs.forEach((x) => x());

    return plays.map((x) => ({
      ...x,
      votes: buffoonIdToVotes[x.buffoonId] ?? [],
    }));
  }

  get_score_increase(plays: Play[]): { [id: string]: number } {
    const scoreIncrease: { [id: string]: number } = {};
    let mostVotes = 0;
    plays.forEach((x) => {
      scoreIncrease[x.twisterId] = x.votes.length * TWISTER_VOTE_SCORE;
      scoreIncrease[x.buffoonId] = x.votes.length * BUFFOON_VOTE_SCORE;

      if (mostVotes < x.votes.length) {
        mostVotes = x.votes.length;
      }
    });

    if (mostVotes !== 0) {
      plays
        .filter((x) => x.votes.length === mostVotes)
        .forEach((x) => {
          scoreIncrease[x.twisterId] =
            MOST_VOTES_MULTIPLIER * TWISTER_VOTE_SCORE;
          scoreIncrease[x.buffoonId] =
            MOST_VOTES_MULTIPLIER * BUFFOON_VOTE_SCORE;
        });
    }

    return scoreIncrease;
  }

  update_score(scoreIncrease: { [id: string]: number }) {
    Object.values(this.players).forEach(
      (player) => (player.score += scoreIncrease[player.botUser.id])
    );
  }

  async display_round_results(plays: Play[]) {
    const msg = await this.mainChannel.send(
      generate_combined_display(plays, CombinedDisplayType.Basic, this.players)
    );
    await sleep(5000);
    await msg.edit(
      generate_combined_display(plays, CombinedDisplayType.Votes, this.players)
    );
    await sleep(5000);
    await msg.edit(
      generate_combined_display(
        plays,
        CombinedDisplayType.Twister,
        this.players
      )
    );
  }

  async display_score(scoreIncrease: { [id: string]: number }) {
    await sleep(5000);
    const sortedScores: [string, number, number][] = Object.entries(
      this.players
    )
      .map(([_, { score, botUser }]): [string, number, number] => [
        botUser.username,
        score,
        scoreIncrease[botUser.id],
      ])
      .sort((a, b) => (a[1] < b[1] ? 1 : -1));

    let scoreDisplay: string[] = [];
    let pos = 0;
    let prevScore = undefined;

    for (let i = 0; i < sortedScores.length; i++) {
      const [username, score, scoreChange] = sortedScores[i];
      if (prevScore !== score) {
        pos = i + 1;
      }
      const fullStopsLen =
        42 -
        (username.length +
          score.toString().length +
          scoreChange.toString().length);
      const fillerFullStops = ".".repeat(fullStopsLen);
      const potentialGap = pos < 10 ? " " : "";
      scoreDisplay.push(
        `${potentialGap}[${pos}] ${username}${fillerFullStops}${score} [+${scoreChange}]`
      );
    }
    await this.mainChannel.send("```css\n" + scoreDisplay.join("\n") + "\n```");
    await sleep(5000);
  }

  async run_part(
    textRequestList: TextRequest[],
    verify: (prompt_id: number, text: string) => Verification,
    timeLimit: number
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

      let dmChannel = user.dmChannel ? user.dmChannel : await user.createDM();

      const filter = (m: Discord.Message) => m.author.id === textReq.userId;
      const collector = dmChannel.createMessageCollector(filter, {
        time: (timeLimit + 5) * 1000,
      });
      user.send(textReq.prompt.prompt);
      const cancel_countdown = send_a_countdown(user, timeLimit);
      collector?.on("collect", (m: Discord.Message) => {
        console.log(`Collected ${m.content}, from ${user.username}`);
        const msg = remove_emojis(m.content).trim();
        const verification = verify(textReq.prompt.id, msg);

        if (verification.valid) {
          onValidText(textReq.userId, msg);
          m.react("✔️");
          cancel_countdown();
          collector.stop("Response Received");
        } else {
          m.react("❌");
          user.send(verification.detail);
        }
      });

      collector?.on("end", (_, reason) => {
        if (reason === "time") {
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

enum CombinedDisplayType {
  Basic = "Basic",
  Votes = "Votes",
  Twister = "Twister",
}

function generate_combined_display(
  plays: Play[],
  type: CombinedDisplayType,
  players: {
    [userId: string]: Player;
  }
): string {
  return plays
    .map((x) => {
      let playDisplay = `${players[x.buffoonId].profileEmoji} ${
        players[x.buffoonId].botUser.username
      }:\n${x.buffoonText}`;

      if (type === CombinedDisplayType.Basic) {
        return playDisplay;
      }

      playDisplay += `\nVotes:\n${x.votes.join("")}`;

      if (type === CombinedDisplayType.Votes) {
        return playDisplay;
      }

      return (
        playDisplay +
        `\nBurned By:\n${players[x.twisterId].profileEmoji} ${
          players[x.twisterId].botUser.username
        }`
      );
    })
    .map((display) => "```" + display + "```")
    .join("\n\n");
}

function get_identity_emojis(num: number): string[] {
  return get_subsection_random_order(
    [
      "🟩",
      "🟥",
      "🟦",
      "🟧",
      "🟨",
      "🟪",
      "🟫",
      "🟠",
      "🟣",
      "🟤",
      "🟡",
      "🔵",
      "🟢",
      "🔴",
    ],
    num
  );
}

export default Game;
