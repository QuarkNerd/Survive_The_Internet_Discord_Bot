import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/jobNetwork";
import { get_subsection_random_order } from "../utilities";

let JobNetwork: Round = {
  ...defaultValues,
  Name: "Social Network",
  Description: "Answer the prompt",
  TwisterPrompt: "Would be a bad way to recommend this person",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) => `${twisterText} \n\n ${twistee_name}: ${twisteeText}`,
};

export default JobNetwork;
