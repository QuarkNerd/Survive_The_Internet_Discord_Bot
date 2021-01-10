import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { newsDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let News: Round = {
  ...defaultValues,
  name: "News",
  description: "Answer the prompt",
  twisterPrompt: "Would look awful under the headline",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: newsDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    " 📰 CIRCULATION NEWS    \n" +
    "--------------------------------------------\n+ " +
    split_to_fit_width(twisterText, 43, 4).join("\n+ ") +
    "\n--------------------------------------------\n" +
    "--- 2nd June 1986 \n" + // TODO make date random, add category
    "--------------------------------------------\n" +
    `- ${buffoonName}:\n     ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n     ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default News;
