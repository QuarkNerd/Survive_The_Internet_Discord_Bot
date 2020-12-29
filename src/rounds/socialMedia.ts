import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { socialMediaDefaultTwists } from "../../resources/defaultTwists";

let SocialMedia: Round = {
  ...defaultValues,
  name: "Social Media",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous with the hashtag:",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: socialMediaDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${buffoon_name}: ${buffoonText} #${twisterText}`,
};

export default SocialMedia;
