import Round, { defaultValues } from "./roundBase";
import Prompts from "../../resources/prompts/default";
import { get_subsection_random_order } from "../utilities";

let VideoSharing: Round = {
  ...defaultValues,
  Name: "Video sharing site",
  Description: "Answer the prompt",
  TwisterPrompt: "Would look ridiculous as a comment on the video",
  GetTwisteePrompts: (num: number) => {
    return get_subsection_random_order(Prompts, num);
  },
  GetResult: (
    twistee_name: string,
    _: number,
    twisteeText: string,
    twisterText: string
  ) => `Video title: ${twisterText} \n\n    ${twistee_name}: ${twisteeText}`,
};

export default VideoSharing;
