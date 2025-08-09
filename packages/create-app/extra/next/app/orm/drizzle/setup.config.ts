import { addEnv, installPackages } from "@/lib/utils";
import type { PM } from "@/src/types";
import cpy from "cpy";
import { rimraf } from "rimraf";
import { join } from "path";

const envs = ["DATABASE_URL="];
const dependencies: string[] = ["drizzle-orm"];
const devDependencies: string[] = ["drizzle-kit"];

const sqlite = "extra/next/app/orm/drizzle/src/sqlite/";
const mysql = "extra/next/app/orm/drizzle/src/mysql/";
const postgres = "extra/next/app/orm/drizzle/src/postgres/";

export async function setupConfig(pm: PM, appDir: string, db: string) {
  let dbDeps: string;
  let templatePath: string;
  switch (db) {
    case "sqlite":
      dbDeps = "better-sqlite3";
      templatePath = sqlite;
      break;
    case "mysql":
      dbDeps = "mysql2";
      templatePath = mysql;
      break;
    case "postgres":
      dbDeps = "postgres";
      templatePath = postgres;
      break;
    default:
      throw new Error(`Unsupported DB type: ${db}`);
  }

  try {
    await cpy(join(templatePath, "db.ts.txt"), join(appDir, "src/db/"), {
      rename: "db.ts",
    });

    await cpy(join(templatePath, "schema.ts.txt"), join(appDir, "src/db/"), {
      rename: "schema.ts",
    });

    await cpy(join(templatePath, "drizzle.config.ts.txt"), appDir, {
      rename: "drizzle.congfig.ts",
    });
    dependencies.push(dbDeps);
    await installPackages(appDir, pm, dependencies, devDependencies);
    await addEnv(envs, join(appDir, ".env.example"));
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
