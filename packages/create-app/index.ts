import { promptUser } from "@/src/userInput";
import { join, resolve } from "path";
import type { PM, SETUP_CONFIG } from "@/src/types";
import cpy from "cpy";
import { rimraf } from "rimraf";
import { removeComments } from "./lib/utils";

async function main() {
  const data = await promptUser();
  const targetDir = resolve(process.cwd(), data.appName);
  const templateDir = join(__dirname, "base", data.framework);

  try {
    await rimraf(targetDir);

    await cpy(join(templateDir, "**"), targetDir, {
      flat: false,
      ignore: ["**/node_modules/**"],
    });

    if (data.ui !== "none") {
      const { setupConfig } = (await import(
        `./extra/next/ui/${data.ui}/setup.config.ts`
      )) as { setupConfig: SETUP_CONFIG };

      await setupConfig(data.packageManager as PM, targetDir);
    }

    await removeComments(join(targetDir, "src/app/layout.tsx"));

  } catch (err) {
    console.error("Setup failed:", err);
    await rimraf(targetDir);
    process.exit(1);
  }
}

main();
