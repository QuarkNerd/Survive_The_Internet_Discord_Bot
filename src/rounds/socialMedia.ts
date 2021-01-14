import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { socialMediaDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

const SocialMedia: Round = {
  ...defaultValues,
  name: "Social Media",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous with the hashtag:",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: socialMediaDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    profileEmoji: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    ` ${profileEmoji.repeat(2)}\n` +
    `-${profileEmoji.repeat(2)} ${buffoonName}:\n+   ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n+   ") +
    "\n   #" +
    split_to_fit_width(
      twisterText[0] === "#" ? twisterText.slice(1) : twisterText,
      40,
      4
    ).join("\n    ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default SocialMedia;
