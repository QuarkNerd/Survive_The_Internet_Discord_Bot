import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { get_subsection_random_order } from "../utilities";

let Crowdfunding: Round = {
  ...defaultValues,
  name: "Crowdfunding",
  description: "Answer the prompt",
  twisterPrompt:
    "Would look terrible if it was in response to campaign titled:",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(basePrompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    `FUND ME PLEASE \n #${twisterText} \n\n\ ${buffoon_name}: ${buffoonText}`,
};

export default Crowdfunding;
