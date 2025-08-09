import { promptUser } from "@/src/userInput";
import { join, resolve } from "path";
import type {
  SETUP_CONFIG,
  SETUP_CONFIG_DB,
  SETUP_CONFIG_ORM,
} from "@/src/types";
import cpy from "cpy";
import { rimraf } from "rimraf";
import { removeComments } from "./lib/utils";

async function main() {
  const data = await promptUser();
  const targetDir = resolve(process.cwd(), data.appName);
  const template = join("base", data.framework, data.variants, "**");
  try {
    await rimraf(join(template, "node_modules"));
    await rimraf(targetDir);
    await cpy(template, targetDir, { flat: false });

    if (data.ui !== "none") {
      const { setupConfig } = (await import(
        `extra/next/${data.variants}/ui/${data.ui}/setup.config.ts`
      )) as { setupConfig: SETUP_CONFIG };
      await setupConfig(data.pm, targetDir);
    }
    if (data.auth !== "none") {
      const { setupConfig } = (await import(
        `extra/next/${data.variants}/auth/${data.auth}/setup.config.ts`
      )) as { setupConfig: SETUP_CONFIG };
      await setupConfig(data.pm, targetDir);
    }
    if (data.database !== "none") {
      const { setupConfig } = (await import(
        `extra/next/${data.variants}/database/${data.database}/setup.config.ts`
      )) as { setupConfig: SETUP_CONFIG_DB };
      await setupConfig(data.pm, targetDir, data.orm !== "none");
    }
    if (data.orm !== "none") {
      const { setupConfig } = (await import(
        `extra/next/${data.variants}/orm/${data.orm}/setup.config.ts`
      )) as { setupConfig: SETUP_CONFIG_ORM };
      await setupConfig(data.pm, targetDir, data.database);
    }

    removeComments(join(targetDir, "src/app/layout.tsx"));
  } catch (err) {
    console.error("Setup failed:", err);
    await rimraf(targetDir);
    process.exit(1);
  }
}

main();
