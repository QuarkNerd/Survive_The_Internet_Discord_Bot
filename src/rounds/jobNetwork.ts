import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/jobNetwork";
import { get_subsection_random_order } from "../utilities";

let JobNetwork: Round = {
  ...defaultValues,
  Name: "Social Network",
  Description: "Answer the prompt",
  TwisterPrompt: "Would be a bad way to recommend this person",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\n ${buffoon_name}: ${buffoonText}`,
};

export default JobNetwork;
