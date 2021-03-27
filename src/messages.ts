import { get_random_element } from "./utilities";

const JOINING_MESSAGES = [
  "%USERNAME% is a good bean, welcome to the game.",
  "%USERNAME% has joined the game.",
  "%USERNAME% is playing. Oh no!",
  "Who said %USERNAME% could play?",
  "So %USERNAME% is playing? That's cool, I guess...",
  "Please welcome, another player iiiiiiiit's %USERNAME%!!!!!!!!!!",
];

const LEAVING_MESSAGES = [
  "%USERNAME% is no longer playing. Big sad.",
  "%USERNAME% has left, PARTY!!!!!!!!",
  "Everyone, let's give a tearful goodbye to %USERNAME%.",
  "So you are too good for us? %USERNAME%?",
];

export function get_joining_message(name: string): string {
  return generate_message(JOINING_MESSAGES, name);
}

export function get_leaving_message(name: string): string {
  return generate_message(LEAVING_MESSAGES, name);
}

function generate_message(array: Array<string>, name: string): string {
  const msg = get_random_element(array);
  return msg.replace("%USERNAME%", name);
}

export const helpMessage =
  "** Requirements **\n" +
  "Technically each player needs any device with discord, but play is ideal on a device that renders emojis properly, check that none of the following are squares 🐶🐱🐰🦊🐻🐼🐻‍🐨🐯🦁❤️🧡💛💚💙💜🖤\n\n\n" +
  "```diff\n" +
  "+ Also, ideally this text should be green\n\n\n" +
  "```\n" +
  "** How to Play **\n" +
  "1. Make sure all players have turned on the setting `Allow direct messages from server members`\n\n" +
  "2. Send `!survive ng` to a server text channel (See below for customisation)\n\n" +
  "3. The Survive Bot will respond to your message\n\n" +
  "4. Everyone who wants to play should like this message (Max. 10)\n\n" +
  "5. Press Tick emoji to start the game or cross to cancel.\n\n" +
  "6. Each player will receive a prompt, they must answer before time runs out (Default 60 sec, Max 100 char)\n\n" +
  "7. Each player will receive a prompt to twist someone's words before time runs out (Default 75 sec, Max 100 char)\n\n" +
  "8. All responses are shared to group, narration can help here. Grey text can be ignored (Added by bot for flavoring)\n\n" +
  "9. Vote by clicking the reactions under the showcase, votes for the messages where you wrote the the 'twist' don't count (Everyone gets 3 votes, all reactions are the same)\n\n" +
  "10. Score are shown\n\n" +
  "11. Steps 6 to 10 are repeated until the end of the game (5 rounds)\n\n" +
  "12. Send `!survive end` to the chat to stop the game at anytime\n\n" +
  "** Customisation **\n" +
  "To customise the game, when you start send `!survive ng W-X-Y-Z` where\n" +
  "`W` is the maximum number of votes someone can give each round (Deafult :3)\n" +
  "`X` is the time limit in the first part of the round (Deafult: 60 seconds)\n" +
  "`Y` is the time limit in the second part of the round (Deafult: 75 seconds)\n" +
  "`Z` is the time limit for the voting (Deafult: 40 seconds)\n\n" +
  "e.g. `!survive ng 5-75-100-50`";
