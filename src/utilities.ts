import Discord from "discord.js";

export function get_subsection_random_order<T>(options: T[], num: number): T[] {
  if (num > options.length) {
    console.error("Function called with number larger than array length");
    return [];
  }

  const rand_nums = generate_n_random_numbers(num, 0, options.length);

  return rand_nums.map((x) => options[x]);
}

export function get_random_element<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function react_in_order(
  msg: Discord.Message,
  emoji_list: string[]
): Promise<null> {
  for (const i in emoji_list) {
    await msg.react(emoji_list[i]);
  }
  return null;
}

export function send_a_countdown(user: Discord.User, time: number) {
  const secondsInterval = 5;
  const msg = user.send(`Time left: ${time}s`);
  const interval = setInterval(async () => {
    time = time - secondsInterval;
    (await msg).edit(`Time left: ${time}s`);
    if (time === 0) {
      clearInterval(interval);
      (await msg).delete();
    }
  }, secondsInterval * 1000);
  };
}

function generate_n_random_numbers(
  n: number,
  min: number,
  max: number
): number[] {
  const nums: Set<number> = new Set();
  while (nums.size !== n) {
    nums.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return [...nums];
}
