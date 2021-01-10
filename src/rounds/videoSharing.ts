import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { videoSharingDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";

let VideoSharing: Round = {
  ...defaultValues,
  name: "Video sharing site",
  description: "Answer the prompt",
  twisterPrompt: "Would look ridiculous as a comment on the video",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: videoSharingDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "⏸ 🔊 ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️⚫◻️◻️◻️◻️◻️◻️◻️◻️\n" +
    "--------------------------------------------\n+    " +
    split_to_fit_width(twisterText, 40, 4).join("\n+    ") +
    "\n--- 👍 120 👎 222\n" +
    "--------------------------------------------\n" +
    `- ${buffoonName}:\n     ` +
    split_to_fit_width(buffoonText, 40, 4).join("\n     ") +
    "\n‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default VideoSharing;
