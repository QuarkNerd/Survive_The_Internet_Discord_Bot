import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { checkInDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let CheckIn: Round = {
  ...defaultValues,
  name: "Check in",
  description: "Answer the prompt",
  twisterPrompt: "Would look silly if said while checking into this location",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: checkInDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "---   CHECKIN\n" +
    "---------------\n" +
    `- ${buffoonName}:\n+   ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n+   ") +
    "\n  📍 " +
    split_to_fit_width(twisterText, 40, 4).join("\n    ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default CheckIn;
