interface Prompt {
  id: string;
  message: string;
  default: string;
}

interface Verification {
  Valid: boolean;
  Detail: string;
}

interface Round {
  Name: string;
  Description: string;
  TwisterPrompt: string;
  GetTwisteePrompts(num: number): Prompt[];
  VerifyTwisteeChoice(prompt_id: number, twisteeChoice: string): Verification;
  VerifyTwisterWords(twisterWords: string): Verification;
  GetResult(
    twistee_name: string,
    prompt_id: number,
    twisteeChoice: string,
    twisterWords: string
  ): string;
}

export default Round;
