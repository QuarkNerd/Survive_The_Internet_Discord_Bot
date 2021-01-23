import Round, { defaultValues } from "./roundBase";
import { basePrompts } from "../../resources/prompts";
import { videoSharingDefaultTwists } from "../../resources/defaultTwists";
import { split_to_fit_width } from "../utilities";
import { create_comment } from "./utilities";

const VideoSharing: Round = {
  ...defaultValues,
  name: "Video sharing site",
  description: "This video is viral",
  twisterPrompt: "Would look ridiculous as a comment on the video",
  possible_buffoon_prompts: basePrompts,
  possible_filler_twister_texts: videoSharingDefaultTwists,
  get_result: (
    buffoonName: string,
    _: number,
    buffoonText: string,
    profileEmoji: string,
    twisterText: string
  ) =>
    "```diff\n" +
    "_____________________________________________\n" +
    "⏸ 🔊 ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️⚫◻️◻️◻️◻️◻️◻️◻️◻️\n" +
    "--------------------------------------------\n+    " +
    split_to_fit_width(twisterText, 40, 4).join("\n+    ") +
    "\n--- 👍 120 👎 222\n" +
    "--------------------------------------------\n" +
    create_comment(buffoonName, profileEmoji, buffoonText) +
    "‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\n```",
};

export default VideoSharing;
