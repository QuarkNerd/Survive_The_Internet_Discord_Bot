import Round, { defaultValues } from "./roundBase";
import { storePrompts } from "../../resources/prompts";
import { storeDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let Store: Round = {
  ...defaultValues,
  name: "Store",
  description: "Answer the prompt",
  twisterPrompt: "Would be an awful review for the product",
  possible_buffoon_prompts: storePrompts,
  possible_filler_twister_texts: storeDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "  BEZOS IS A BITCH    ⬜⬜⬜⬜⬜🔎  🛒\n" +
    "--------------------------------------------\n+   " +
    split_to_fit_width(twisterText, 41, 4).join("\n+   ") +
    "\n--- ⭐⭐☆☆☆                 Qty: 1 🔽 🛍️\n" +
    "--------------------------------------------\n" +
    "Reviews\n" +
    "--------------------------------------------\n" +
    `- ${buffoonName}:\n     ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n     ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default Store;
