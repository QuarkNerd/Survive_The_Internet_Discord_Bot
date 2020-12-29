import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { checkInDefaultTwists } from "../../resources/defaultTwists";

let CheckIn: Round = {
  ...defaultValues,
  name: "Social Media",
  description: "Answer the prompt",
  twisterPrompt: "Would look silly if said while checking into this location",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: checkInDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${buffoon_name}: ${buffoonText} 📍${twisterText}`,
};

export default CheckIn;
