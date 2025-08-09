import { addEnv, installPackages } from "@/lib/utils";
import type { PM } from "@/src/types";
import { rimraf } from "rimraf";
import { join } from "path";
import cpy from "cpy";

const CONFIG_DIR = "extra/next/app/database/mysql/src";

const dependencies: string[] = ["mysql2"];
const devDependencies: string[] = [];

const envs = ["DATABASE_URL="];

export async function setupConfig(
  pm: PM,
  appDir: string,
  hasOrm: boolean,
): Promise<void> {
  if (hasOrm) return;
  try {
    await cpy(join(CONFIG_DIR, "connect.ts.txt"), join(appDir, "src/lib"), {
      rename: "connect.ts",
    });

    await cpy(
      join(CONFIG_DIR, "route.ts.txt"),
      join(appDir, "src/app/api/example"),
      {
        rename: "route.ts",
      },
    );
    await addEnv(envs, join(appDir, ".env.example"));
    await installPackages(appDir, pm, dependencies, devDependencies);
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
