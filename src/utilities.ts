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
    if ((code > 64 && code < 91) || (code > 96 && code < 123) || code === 39) {
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

export function remove_emojis(string: string): string {
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, "");
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
