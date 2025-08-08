import prompts from "prompts";
import { defaultValue, questions } from "./data";
import { handleCancel } from "@/lib/utils";
export async function promptUser() {
  const answers = await prompts(questions, { onCancel: handleCancel });

  return { ...defaultValue, ...answers };
}
