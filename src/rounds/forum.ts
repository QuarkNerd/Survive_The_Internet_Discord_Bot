import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { forumDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let Forum: Round = {
  ...defaultValues,
  name: "Forum",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment to the question",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: forumDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    " ? STICK YOUR NOSE WHERE IT DON'T BELONG ?\n" +
    "--------------------------------------------\n+ " +
    split_to_fit_width(
      twisterText + (twisterText[twisterText.length - 1] === "?" ? "" : "?"),
      41,
      4
    ).join("\n+ ") +
    "\n--------------------------------------------\n" +
    "---ANSWERS\n" +
    "--------------------------------------------\n" +
    `- ${buffoonName}:\n     ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n     ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default Forum;
