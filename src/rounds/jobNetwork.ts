import Round, { defaultValues } from "./roundBase";
import { jobNetworkPrompts } from "../../resources/prompts";
import { jobNetworkDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let JobNetwork: Round = {
  ...defaultValues,
  name: "Job Network",
  description: "Answer the prompt",
  twisterPrompt: "Would be a bad way to recommend this person",
  possible_buffoon_prompts: jobNetworkPrompts,
  possible_filler_twister_texts: jobNetworkDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    `-    ${buffoonName}:\n` +
    "     RECOMMENDS  \n+    " +
    split_to_fit_width(twisterText, 40, 4).join("\n+    ") +
    "\n---------------------------------------------\n" +
    split_to_fit_width(`"${buffoonText}"`, 45, 4).join("\n") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default JobNetwork;
