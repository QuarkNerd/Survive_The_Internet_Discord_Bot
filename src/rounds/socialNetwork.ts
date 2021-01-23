import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { socialNetworkDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";
import { create_comment } from "./utilities";

const SocialNetwork: Round = {
  ...defaultValues,
  name: "Social Network",
  description: "You post too much on SocialNetwork",
  twisterPrompt: "Would look ridiculous as a comment to the post",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: socialNetworkDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    profileEmoji: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "---⚫⬛  *********\n" +
    "---⬛⚫ 21st June 2018\n+  " +
    split_to_fit_width(twisterText, 42, 4).join("\n+  ") +
    "\n---     👍 Like  💬 Comment  🔗 Share\n" +
    "--------------------------------------------\n" +
    create_comment(buffoonName, profileEmoji, buffoonText) +
    "‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default SocialNetwork;
