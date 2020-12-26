import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let CheckIn: Round = {
  ...defaultValues,
  Name: "Social Media",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look silly if said while checking into this location",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) => `${twistee_name}: ${twisteeText} 📍${twisterText}`,
};

export default CheckIn;
