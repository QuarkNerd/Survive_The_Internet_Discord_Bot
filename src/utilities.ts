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

export function send_a_countdown(user: Discord.User, time: number): () => void {
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

  return async () => {
    if (time > 0) {
      clearInterval(interval);
      (await msg).delete();
    }
  };
}

export function sleep(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function split_to_fit_width(
  text: string,
  width: number,
  negativeTolerance: number
): string[] {
  text = text.trim();
  const splitText: string[] = [];

  while (text.length > width) {
    let wasSplitDone = false;

    for (let i = 0; i < negativeTolerance; i++)
      if (text[width - i] === " ") {
        splitText.push(text.slice(0, width - i));
        text = text.slice(width - i + 1);
        wasSplitDone = true;
        break;
      }

    if (wasSplitDone) {
      continue;
    }

    const code = text.charCodeAt(width - 1);
    if (code > 64 && code < 91 && code > 96 && code < 123) {
      splitText.push(text.slice(0, width - 1) + "-");
      text = "-" + text.slice(width - 1);
    } else {
      splitText.push(text.slice(0, width));
      text = text.slice(width);
    }
  }

  if (text) {
    splitText.push(text);
  }

  return splitText;
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
