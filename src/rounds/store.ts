import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/store";
import { get_subsection_random_order } from "../utilities";

let Store: Round = {
  ...defaultValues,
  Name: "Store",
  Description: "Answer the prompt",
  TwisterPrompt: "Would be an awful review for the product",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nReviews: \n${buffoon_name}: ${buffoonText}`,
};

export default Store;
