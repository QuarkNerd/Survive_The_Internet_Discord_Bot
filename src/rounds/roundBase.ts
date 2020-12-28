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
  GetBuffoonPrompts(num: number): Prompt[];
  VerifyBuffoonText(prompt_id: number, buffoonText: string): Verification;
  VerifyTwisterText(twisterText: string): Verification;
  GetResult(
    buffoon_name: string,
    prompt_id: number,
    buffoonText: string,
    twisterText: string
  ): string;
}

const defaultValues = {
  VerifyBuffoonText: function (_: number, buffoonText: string): Verification {
    if (buffoonText.length < 100) {
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
