import { promptUser } from "@/src/userInput";
import type { PM, SETUP_CONFIG } from "@/src/types";
import cpy from "cpy";
import path from "path";
import { rimraf } from "rimraf";

async function main() {
  const data = await promptUser();
  const targetDir = path.resolve(process.cwd(), data.appName);
  const template = path.join("base", data.framework, "**");
  console.log(template);

  await cpy(template, targetDir, { flat: false });
  try {
    if (data.ui !== "none") {
      const { setupConfig } = (await import(
        `extra/next/ui/${data.ui}/setup.config`
      )) as { setupConfig: SETUP_CONFIG };
      await setupConfig(data.packageManager as PM, targetDir);
    }
  } catch (err) {
    console.error("Setup failed:", err);
    await rimraf(targetDir);
    process.exit(1);
  }
}

main();
