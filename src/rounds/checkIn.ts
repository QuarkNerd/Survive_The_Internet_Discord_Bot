import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let CheckIn: Round = {
  ...defaultValues,
  Name: "Social Media",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look silly if said while checking into this location",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${buffoon_name}: ${buffoonText} 📍${twisterText}`,
};

export default CheckIn;
