import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { crowdFundingDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let Crowdfunding: Round = {
  ...defaultValues,
  name: "Crowdfunding",
  description: "Answer the prompt",
  twisterPrompt:
    "Would look terrible if it was in response to campaign titled:",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: crowdFundingDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "     £ £ £ £ FundStuffForReasons £ £ £ £     \n" +
    "--------------------------------------------\n+ " +
    split_to_fit_width(twisterText, 43, 4).join("\n+ ") +
    "\n--------------------------------------------\n" +
    "--- £4234 💎 RAISED -- 87898 🙋 Supporters\n" +
    "--------------------------------------------\n" +
    `- ${buffoonName}:\n     ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n     ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default Crowdfunding;
