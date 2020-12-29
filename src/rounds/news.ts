import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { get_subsection_random_order } from "../utilities";

let News: Round = {
  ...defaultValues,
  name: "News",
  description: "Answer the prompt",
  twisterPrompt: "Would look awful under the headline",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(basePrompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nCOMMENTS \n${buffoon_name}: ${buffoonText}`,
};

export default News;
