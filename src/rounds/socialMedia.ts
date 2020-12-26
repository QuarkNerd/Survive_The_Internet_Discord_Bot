import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let SocialMedia: Round = {
  ...defaultValues,
  Name: "Social Media",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look ridiculous with the hashtag:",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) => `${twistee_name}: ${twisteeText} #${twisterText}`,
};

export default SocialMedia;
