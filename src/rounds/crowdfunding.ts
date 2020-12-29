import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { crowdFundingDefaultTwists } from "../../resources/defaultTwists";

let Crowdfunding: Round = {
  ...defaultValues,
  name: "Crowdfunding",
  description: "Answer the prompt",
  twisterPrompt:
    "Would look terrible if it was in response to campaign titled:",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: crowdFundingDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    `FUND ME PLEASE \n #${twisterText} \n\n\ ${buffoon_name}: ${buffoonText}`,
};

export default Crowdfunding;
