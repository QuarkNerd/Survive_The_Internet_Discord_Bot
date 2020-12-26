import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let Crowdfunding: Round = {
  ...defaultValues,
  Name: "Crowdfunding",
  Description: "Answer the prompt",
  TwisterPrompt:
    "Would look terrible if it was in response to campaign titled:",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) =>
    `FUND ME PLEASE \n #${twisterText} \n\n\ ${twistee_name}: ${twisteeText}`,
};

export default Crowdfunding;
