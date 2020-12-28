import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/jobNetwork";
import { get_subsection_random_order } from "../utilities";

let JobNetwork: Round = {
  ...defaultValues,
  name: "Social Network",
  description: "Answer the prompt",
  twisterPrompt: "Would be a bad way to recommend this person",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\n ${buffoon_name}: ${buffoonText}`,
};

export default JobNetwork;
