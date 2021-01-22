import Discord from "discord.js";

import Round, { Prompt, possibleRounds, Verification } from "./rounds";
import {
  get_subsection_random_order,
  get_random_element,
  react_in_order,
  send_a_countdown,
  sleep,
  remove_emojis,
  convert_from_milliseconds,
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
  showcaseMsg?: Discord.Message;
  votes: string[];
}

interface TextRequest {
  userId: string;
  user: Discord.User;
  prompt: Prompt;
}

//TODO customiseable
const MAX_VOTES = 3;
const VOTING_EMOJIS = ["🌕", "🌖", "🌗", "🌘", "🌑"]; //, "🌒", "🌓", "🌔"];

const PART_ONE_TIME_LIMIT = 60;
const PART_TWO_TIME_LIMIT = 75;
const VOTING_TIME_LIMIT = 40;

const TWISTER_VOTE_SCORE = 100;
const BUFFOON_VOTE_SCORE = 10;
const MOST_VOTES_MULTIPLIER = 1.5;

class Game {
  players: {
    [userId: string]: Player;
  } = {};
  rounds: Round[];
  mainChannel: Discord.TextChannel;
  timeStamp: number;

  constructor(mainChannel: Discord.TextChannel) {
    this.rounds = get_subsection_random_order(possibleRounds, 9);
    this.mainChannel = mainChannel;
    this.timeStamp = Date.now();
  }

  start(players: Discord.User[]) {
    const profileEmojiList = get_identity_emojis(players.length);

    players.forEach((player, i) => {
      this.players[player.id] = {
        botUser: player,
        score: 0,
        profileEmoji: profileEmojiList[i],
      };
    });

    this.log(
      "start",
      players
        .map((x, i) => `${x.id}-${x.username}-${profileEmojiList[i]}`)
        .join(",")
    );

    this.play();
  }

  async play() {
    for (let i = 0; i < this.rounds.length; i++) {
      await this.run_round(this.rounds[i], i);
    }
  }

  async run_round(round: Round, num: number) {
    this.log("run_round", `RoundName: ${round.name}`);

    this.mainChannel.send(`Round ${num + 1}: ${round.name}`);
    // todo move these things into functions
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

    this.log(
      "run_round",
      `Plays beginning of round: ${JSON.stringify({
        ...plays,
        showcaseMsg: undefined,
      })}`
    );

    plays = await this.run_part_one(plays, round);
    plays = await this.run_part_two(plays, round);
    plays = await this.showcase_responses(plays, round);
    plays = await this.run_voting(plays);
    await this.display_votes_and_twister(plays);
    const scoreIncrease = this.get_score_increase(plays);
    this.update_score(scoreIncrease);
    await this.display_score(scoreIncrease);
    this.log(
      "run_round",
      `Plays end of round: ${JSON.stringify({
        ...plays,
        showcaseMsg: undefined,
      })}`
    );
    this.log(
      "run_round",
      `Players end of round: ${Object.values(this.players)
        .map((x) => `${x.botUser.username}:${x.score}`)
        .join(",")}`
    );
  }

  async run_part_one(plays: Play[], round: Round): Promise<Play[]> {
    this.log("run_part_one", round.name);
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
    this.log("run_part_two", round.name);
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

  async showcase_responses(plays: Play[], round: Round): Promise<Play[]> {
    this.log("showcase_responses", round.name);
    this.mainChannel.send("Let's see what you have come up with!");
    const playsWithMessages: Play[] = [];
    await sleep(4000);
    for (let i = 0; i < plays.length; i++) {
      const x = plays[i];
      const FAKE_ID = 0;
      const buffoonUsername = this.get_name(x.buffoonId);
      if (!x.buffoonText || !x.twisterText) {
        this.log(
          "showcase_responses",
          `Text in play is undefined ${JSON.stringify(x)}`
        );
        continue;
      }
      const showcaseMsg = await this.mainChannel.send(
        round.get_result(
          buffoonUsername,
          FAKE_ID,
          x.buffoonText,
          this.players[x.buffoonId].profileEmoji,
          ""
        )
      );
      await sleep(4000);

      await showcaseMsg.edit(
        round.get_result(
          buffoonUsername,
          FAKE_ID,
          x.buffoonText,
          this.players[x.buffoonId].profileEmoji,
          x.twisterText
        )
      );
      await sleep(4000);
      playsWithMessages.push({
        ...x,
        showcaseMsg,
      });
      await sleep(8000);
    }

    return playsWithMessages;
  }

  async run_voting(plays: Play[]): Promise<Play[]> {
    this.log("run_voting", "");
    const botEmojiReactPromises: Promise<null>[] = [];
    const collectors: Discord.ReactionCollector[] = [];
    const votesGivenToBuffoonsByVoterId: { [id: string]: string[] } = {};

    for (let i = 0; i < plays.length; i++) {
      const x = plays[i];

      const filter_reaction = (
        reaction: Discord.MessageReaction,
        user: Discord.User
      ) =>
        user.id !== x.twisterId &&
        this.players[user.id] !== undefined &&
        VOTING_EMOJIS.indexOf(reaction.emoji.name) != -1;

      if (!x.showcaseMsg) {
        this.log(
          "run_voting",
          `Showcase message undefined! ${JSON.stringify(x)}`
        );
        continue;
      }

      botEmojiReactPromises.push(react_in_order(x.showcaseMsg, VOTING_EMOJIS));
      const collector = x.showcaseMsg.createReactionCollector(filter_reaction, {
        time: 100000,
      });
      collectors.push(collector);

      collector.on("collect", (reaction, user) => {
        this.log(
          "run_voting",
          `Collected ${reaction.emoji.name} from ${
            user.tag
          } on play by twister ${this.get_name(x.twisterId)}`
        );
        if (!votesGivenToBuffoonsByVoterId[user.id]) {
          votesGivenToBuffoonsByVoterId[user.id] = [];
        }
        votesGivenToBuffoonsByVoterId[user.id].push(x.buffoonId);
      });
    }

    await Promise.all(botEmojiReactPromises);
    send_a_countdown(this.mainChannel, VOTING_TIME_LIMIT);
    await sleep((VOTING_TIME_LIMIT + 5) * 1000);
    collectors.forEach((x) => x.stop("Time up"));

    const votesReceivedByBuffoonId: { [id: string]: string[] } = plays.reduce(
      (acc, curr) => {
        acc[curr.buffoonId] = [];
        return acc;
      },
      {}
    );

    Object.keys(votesGivenToBuffoonsByVoterId).forEach((voterId: string) => {
      const votes = votesGivenToBuffoonsByVoterId[voterId];
      for (let i = 0; i < MAX_VOTES && i < votes.length; i++) {
        votesReceivedByBuffoonId[votes[i]].push(
          this.players[voterId].profileEmoji
        );
      }
    });
    this.log("run_voting", JSON.stringify(votesReceivedByBuffoonId));

    return plays.map((x) => ({
      ...x,
      votes: votesReceivedByBuffoonId[x.buffoonId],
    }));
  }

  get_score_increase(plays: Play[]): { [id: string]: number } {
    const scoreIncrease: { [id: string]: number } = Object.keys(
      this.players
    ).reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {});
    let mostVotes = 0;
    plays.forEach((x) => {
      scoreIncrease[x.twisterId] += x.votes.length * TWISTER_VOTE_SCORE;
      scoreIncrease[x.buffoonId] += x.votes.length * BUFFOON_VOTE_SCORE;

      if (mostVotes < x.votes.length) {
        mostVotes = x.votes.length;
      }
    });

    if (mostVotes !== 0) {
      plays
        .filter((x) => x.votes.length === mostVotes)
        .forEach((x) => {
          scoreIncrease[x.twisterId] +=
            MOST_VOTES_MULTIPLIER * TWISTER_VOTE_SCORE;
          scoreIncrease[x.buffoonId] +=
            MOST_VOTES_MULTIPLIER * BUFFOON_VOTE_SCORE;
        });
    }

    this.log("get_score_increase", JSON.stringify(scoreIncrease));
    return scoreIncrease;
  }

  update_score(scoreIncrease: { [id: string]: number }) {
    Object.values(this.players).forEach(
      (player) => (player.score += scoreIncrease[player.botUser.id])
    );
  }

  async display_votes_and_twister(plays: Play[]) {
    this.log("display_votes_and_twister", "");
    const whoVotedMsg = await this.mainChannel.send(
      "Let's see who voted for what"
    );
    await Promise.all(
      plays.map((x) => {
        if (!x.showcaseMsg) return;
        const newContent =
          x.showcaseMsg.content +
          "```     Votes:\n     " +
          x.votes.join("") +
          "```";
        x.showcaseMsg.edit(newContent);
      })
    );
    await sleep(5000);
    whoVotedMsg.delete();
    const whoTwisterMsg = await this.mainChannel.send(
      "Let's see who burned you"
    );
    await Promise.all(
      plays.map((x) => {
        if (!x.showcaseMsg) return;
        const oldContent = x.showcaseMsg.content;
        const newContent =
          oldContent.substring(0, oldContent.length - 3) +
          "\n     Burned By:\n     " +
          this.players[x.twisterId].profileEmoji +
          this.get_name(x.twisterId) +
          "```\n\n";
        x.showcaseMsg.edit(newContent);
      })
    );
    await sleep(5000);
    whoTwisterMsg.delete();
  }

  async display_score(scoreIncrease: { [id: string]: number }) {
    this.log("display_score", "");
    await sleep(5000);
    const sortedScores: [string, string, number, number][] = Object.entries(
      this.players
    )
      .map(([_, { profileEmoji, score, botUser }]): [
        string,
        string,
        number,
        number
      ] => [botUser.username, profileEmoji, score, scoreIncrease[botUser.id]])
      .sort((a, b) => (a[1] < b[1] ? 1 : -1));

    let scoreDisplay: string[] = [];
    let pos = 0;
    let prevScore = undefined;

    for (let i = 0; i < sortedScores.length; i++) {
      const [username, profileEmoji, score, scoreChange] = sortedScores[i];
      if (prevScore !== score) {
        pos = i + 1;
      }
      const fullStopsLen = 34 - (username.length + score.toString().length);
      const fillerFullStops = ".".repeat(fullStopsLen);
      const potentialGap = pos < 10 ? " " : "";
      const scoreChangeGap = 5 - scoreChange.toString().length;
      const fillerSpaceGap = " ".repeat(scoreChangeGap);
      scoreDisplay.push(
        `${potentialGap}[${pos}] ${profileEmoji} ${username}${fillerFullStops}${score} [+${fillerSpaceGap}${scoreChange}]`
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
      const cancel_countdown = send_a_countdown(dmChannel, timeLimit);
      collector?.on("collect", (m: Discord.Message) => {
        this.log("run_part", `Collected ${m.content}, from ${user.username}`);

        const msg = remove_emojis(m.content).trim();
        const verification = verify(textReq.prompt.id, msg);

        if (verification.valid) {
          onValidText(textReq.userId, msg);
          m.react("✔️");
          this.log("run_part", `Accepted ${m.content}, from ${user.username}`);
          cancel_countdown();
          collector.stop("Response Received");
        } else {
          m.react("❌");
          this.log("run_part", `Rejected ${m.content}, from ${user.username}`);
          user.send(verification.detail);
        }
      });

      collector?.on("end", (_, reason) => {
        if (reason === "time") {
          onValidText(textReq.userId, textReq.prompt.default);
          dmChannel.send("You ran out of time. Using default answer");
          this.log("run_part", `Timed out ${user.username}`);
        }
      });

      if (!collector) {
        this.log(
          "run_part",
          `collector is undefined, and playerId is ${user.username}`
        );
      }
    });

    return new Promise((res, _) => {
      resolveCallback = res;
    });
  }

  get_name(id: string): string {
    return this.players[id].botUser.username;
  }

  log(funcName: string, details: string) {
    console.log(
      `${this.timeStamp}|${funcName}|${details}|${convert_from_milliseconds(
        Date.now() - this.timeStamp
      )}`
    );
  }
}

function get_identity_emojis(num: number): string[] {
  return get_subsection_random_order(
    [
      "🐶",
      "🐱",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐻‍",
      "🐨",
      "🐯",
      "🦁",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
    ],
    num
  );
}

export default Game;
