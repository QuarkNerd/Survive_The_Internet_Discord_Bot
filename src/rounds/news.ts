import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let News: Round = {
  ...defaultValues,
  Name: "News",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look awful under the headline",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nCOMMENTS \n${buffoon_name}: ${buffoonText}`,
};

export default News;
