import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let SocialNetwork: Round = {
  ...defaultValues,
  Name: "Social Network",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look ridiculous as a comment to the post",
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

export default SocialNetwork;
