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
  get_buffoon_prompts(num: number): Prompt[];
  verify_buffoon_text(prompt_id: number, buffoonText: string): Verification;
  verify_twister_text(twisterText: string): Verification;
  get_result(
    buffoon_name: string,
    prompt_id: number,
    buffoonText: string,
    twisterText: string
  ): string;
}

const defaultValues = {
  verify_buffoon_text: function (_: number, buffoonText: string): Verification {
    if (buffoonText.length < 100) {
      return { valid: true };
    } else {
      return { valid: false, detail: "too long" };
    }
  },
  verify_twister_text: function (twisterText: string): Verification {
    if (twisterText.length < 100) {
      return { valid: true };
    } else {
      return { valid: false, detail: "too long" };
    }
  },
};

export { defaultValues };
export default Round;
