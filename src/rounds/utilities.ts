import { split_to_fit_width } from "../utilities";

export function create_comment(
  username: string,
  profileEmoji: string,
  text: string
): string {
  const split = split_to_fit_width(text, 39, 4);
  const firstLine = split.shift();
  return (
    `\n- ${username}:\n` +
    `${profileEmoji.repeat(2)} ${firstLine}\n${profileEmoji.repeat(2)} ` +
    split.join("\n      ") +
    "\n"
  );
}
