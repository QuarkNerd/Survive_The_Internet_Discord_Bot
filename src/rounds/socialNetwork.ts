import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { socialNetworkDefaultTwists } from "../../resources/defaultTwists";

let SocialNetwork: Round = {
  ...defaultValues,
  name: "Social Network",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment to the post",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: socialNetworkDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nCOMMENTS \n${buffoon_name}: ${buffoonText}`,
};

export default SocialNetwork;
