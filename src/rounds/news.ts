import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let News: Round = {
  ...defaultValues,
  Name: "News",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look awful under the headline",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) => `${twisterText} \n\nCOMMENTS \n${twistee_name}: ${twisteeText}`,
};

export default News;
