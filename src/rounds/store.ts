import Round, { defaultValues } from "./roundBase";
import { storePrompts } from "../../resources/prompts";
import { storeDefaultTwists } from "../../resources/defaultTwists";

let Store: Round = {
  ...defaultValues,
  name: "Store",
  description: "Answer the prompt",
  twisterPrompt: "Would be an awful review for the product",
  possible_buffoon_prompts: storePrompts,
  possible_filler_twister_texts: storeDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nReviews: \n${buffoon_name}: ${buffoonText}`,
};

export default Store;
