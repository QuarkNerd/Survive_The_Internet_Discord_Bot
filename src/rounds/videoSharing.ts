import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let VideoSharing: Round = {
  ...defaultValues,
  Name: "Video sharing site",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look ridiculous as a comment on the video",
  GetBuffoonPrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `Video title: ${twisterText} \n\n    ${buffoon_name}: ${buffoonText}`,
};

export default VideoSharing;
