import { addEnv, installPackages, runCommand } from "@/lib/utils";
import type { PM } from "@/src/types";
import { rimraf } from "rimraf";
import { join } from "path";
import cpy from "cpy";

const CONFIG_DIR = "extra/next/app/orm/prisma/src";

const dependencies: string[] = [
  "@prisma/client",
  "@prisma/extension-accelerate",
];
const devDependencies: string[] = ["prisma"];

const envs = ["DATABASE_URL="];

export async function setupConfig(
  pm: PM,
  appDir: string,
  dbProvider: string,
): Promise<void> {
  try {
    await cpy(join(CONFIG_DIR, "prisma.ts.txt"), join(appDir, "src/lib"), {
      rename: "prisma.ts",
    });
    await addEnv(envs, join(appDir, ".env.example"));
    await installPackages(appDir, pm, dependencies, devDependencies);
    await runCommand(appDir, pm, [
      "prisma",
      "init",
      "--datasource-provider",
      dbProvider,
    ]);
    await runCommand(appDir, pm, ["prisma", "generate"]);
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
