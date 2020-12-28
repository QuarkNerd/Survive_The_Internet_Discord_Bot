import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let Forum: Round = {
  ...defaultValues,
  Name: "Social Network",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look ridiculous as a comment to the question",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nAnswers \n${buffoon_name}: ${buffoonText}`,
};

export default Forum;
