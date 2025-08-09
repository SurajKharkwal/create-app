import { installPackages, patchFile } from "@/lib/utils";
import type { PM } from "@/src/types";
import { rimraf } from "rimraf";
import cpy from "cpy";
import { join } from "path";

const CONFIG_DIR = "extra/next/pages/ui/hero/src";

const dependencies: string[] = [
  "@heroui/system",
  "@heroui/theme",
  "framer-motion",
  "next-themes",
];
const devDependencies: string[] = [];

const heroUIPatches = {
  "{/*hero_import*/}":
    'import { HeroProvider } from "@src/components/hero-provider";',
  "{/*hero_provider_start*/}": "<HeroProvider>",
  "{/*hero_provider_end*/}": "</HeroProvider>",
};

export async function setupConfig(pm: PM, appDir: string): Promise<void> {
  try {
    await cpy(join(CONFIG_DIR, "globals.css.txt"), join(appDir, "src/app"), {
      rename: "globals.css",
      overwrite: true,
    });
    await cpy(join(CONFIG_DIR, "hero.ts.txt"), join(appDir, "src/app"), {
      rename: "hero.ts",
    });
    await cpy(
      join(CONFIG_DIR, "provider.tsx.txt"),
      join(appDir, "src/components"),
      {
        rename: "hero-provider.tsx",
      },
    );

    await patchFile(join(appDir, "src/app/layout.tsx"), heroUIPatches);
    await installPackages(appDir, pm, dependencies, devDependencies);
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
