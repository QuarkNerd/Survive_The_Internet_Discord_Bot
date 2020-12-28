import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let Forum: Round = {
  ...defaultValues,
  name: "Social Network",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment to the question",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nAnswers \n${buffoon_name}: ${buffoonText}`,
};

export default Forum;
