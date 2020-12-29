import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { videoSharingDefaultTwists } from "../../resources/defaultTwists";

let VideoSharing: Round = {
  ...defaultValues,
  name: "Video sharing site",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment on the video",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: videoSharingDefaultTwists,
  get_result: (
    buffoon_name: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) => `Video title: ${twisterText} \n\n    ${buffoon_name}: ${buffoonText}`,
};

export default VideoSharing;
