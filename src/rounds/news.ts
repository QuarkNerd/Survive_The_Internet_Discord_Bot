import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { newsDefaultTwists } from "../../resources/defaultTwists";

let News: Round = {
  ...defaultValues,
  name: "News",
  description: "Answer the prompt",
  twisterPrompt: "Would look awful under the headline",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: newsDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nCOMMENTS \n${buffoon_name}: ${buffoonText}`,
};

export default News;
