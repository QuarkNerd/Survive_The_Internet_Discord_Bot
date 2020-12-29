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
