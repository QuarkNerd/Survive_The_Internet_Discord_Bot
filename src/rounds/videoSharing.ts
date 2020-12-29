import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { get_subsection_random_order } from "../utilities";

let VideoSharing: Round = {
  ...defaultValues,
  name: "Video sharing site",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment on the video",
  get_buffoon_prompts: (num: number) => {
    return get_subsection_random_order(basePrompts, num);
  },
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `Video title: ${twisterText} \n\n    ${buffoon_name}: ${buffoonText}`,
};

export default VideoSharing;
