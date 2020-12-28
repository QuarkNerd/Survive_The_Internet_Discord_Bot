import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let SocialMedia: Round = {
  ...defaultValues,
  name: "Social Media",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous with the hashtag:",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${buffoon_name}: ${buffoonText} #${twisterText}`,
};

export default SocialMedia;
