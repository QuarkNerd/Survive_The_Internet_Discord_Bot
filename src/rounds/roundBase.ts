interface Prompt {
  id: number;
  prompt: string;
  default: string;
}

interface Verification {
  valid: boolean;
  detail?: string;
}

interface Round {
  Name: string;
  Description: string;
  TwisterPrompt: string;
  GetTwisteePrompts(num: number): Prompt[];
  VerifyTwisteeText(prompt_id: number, twisteeText: string): Verification;
  VerifyTwisterText(twisterText: string): Verification;
  GetResult(
    twistee_name: string,
    prompt_id: number,
    twisteeText: string,
    twisterText: string
  ): string;
}

const defaultValues = {
  VerifyTwisteeText: function (_: number, twisteeText: string): Verification {
    if (twisteeText.length < 100) {
      return { valid: true };
    } else {
      return { valid: false, detail: "too long" };
    }
  },
  VerifyTwisterText: function (twisterText: string): Verification {
    if (twisterText.length < 100) {
      return { valid: true };
    } else {
      return { valid: false, detail: "too long" };
    }
  },
};

export { defaultValues };
export default Round;
