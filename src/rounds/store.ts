import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/store";
import { get_subsection_random_order } from "../utilities";

let Store: Round = {
  ...defaultValues,
  name: "Store",
  description: "Answer the prompt",
  twisterPrompt: "Would be an awful review for the product",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nReviews: \n${buffoon_name}: ${buffoonText}`,
};

export default Store;
