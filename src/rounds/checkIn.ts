import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { get_subsection_random_order } from "../utilities";

let CheckIn: Round = {
  ...defaultValues,
  name: "Social Media",
  description: "Answer the prompt",
  twisterPrompt: "Would look silly if said while checking into this location",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(basePrompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${buffoon_name}: ${buffoonText} 📍${twisterText}`,
};

export default CheckIn;
