import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { get_subsection_random_order } from "../utilities";

let SocialNetwork: Round = {
  ...defaultValues,
  name: "Social Network",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment to the post",
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

export default SocialNetwork;
