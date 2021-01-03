import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { forumDefaultTwists } from "../../resources/defaultTwists";

let Forum: Round = {
  ...defaultValues,
  name: "Forum",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment to the question",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: forumDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `${twisterText} \n\nAnswers \n${buffoon_name}: ${buffoonText}`,
};

export default Forum;
