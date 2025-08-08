import chalk from "chalk";
import prompts from "prompts";
import { defaultValue, questions } from "./data";
export async function promptUser() {
  const onCancel = () => {
    console.log(chalk.red("\n❌ Setup cancelled by user."));
    process.exit(1);
  };

  const answers = await prompts(questions, { onCancel });

  return { ...defaultValue, ...answers };
}
