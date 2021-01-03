import Round, { defaultValues } from "./roundBase";
import { jobNetworkPrompts } from "../../resources/prompts";
import { jobNetworkDefaultTwists } from "../../resources/defaultTwists";

let JobNetwork: Round = {
  ...defaultValues,
  name: "Job Network",
  description: "Answer the prompt",
  twisterPrompt: "Would be a bad way to recommend this person",
  possible_buffoon_prompts: jobNetworkPrompts,
  possible_filler_twister_texts: jobNetworkDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\n ${buffoon_name}: ${buffoonText}`,
};

export default JobNetwork;
