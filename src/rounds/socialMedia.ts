import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { socialMediaDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let SocialMedia: Round = {
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
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "                 \n" +
    `-     ${buffoonName}:\n` +
    split_to_fit_width(`"${buffoonText}"`, 45, 4).join("\n") +
    "\n+ " +
    split_to_fit_width(
      (twisterText[0] === "#" ? "" : "#") + twisterText,
      43,
      4
    ).join("\n+ ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default SocialMedia;
