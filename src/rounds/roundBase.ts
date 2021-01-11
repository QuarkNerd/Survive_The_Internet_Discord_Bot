interface Prompt {
  id: number;
  prompt: string;
  default: string;
}

type Verification =
  | {
      valid: false;
      detail: string;
    }
  | { valid: true };

interface Round {
  name: string;
  description: string;
  twisterPrompt: string;
  possible_buffoon_prompts: Prompt[];
  possible_filler_twister_texts: string[];
  verify_buffoon_text(prompt_id: number, buffoonText: string): Verification;
  verify_twister_text(twisterText: string): Verification;
  get_result(
    buffoon_name: string,
    prompt_id: number,
    buffoonText: string,
    profileEmoji: string,
    twisterText: string
  ): string;
}

function defaultVerifyText(text: string): Verification {
  const maxLength = 100;
  if (text.length > maxLength) {
    return {
      valid: false,
      detail: `Too long. Max Length: ${maxLength}. Current Length: ${text.length}`,
    };
  }
  return { valid: true };
}

const defaultValues = {
  verify_buffoon_text: function (_: number, buffoonText: string): Verification {
    return defaultVerifyText(buffoonText);
  },
  verify_twister_text: defaultVerifyText,
};

export { defaultValues, Prompt, Verification };
export default Round;
