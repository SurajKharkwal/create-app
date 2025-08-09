import { installPackages, patchFile, removeComments } from "@/lib/utils";
import type { PM } from "@/src/types";
import { rimraf } from "rimraf";
import cpy from "cpy";
import { join } from "path";

const CONFIG_DIR = join(__dirname, "src");

const dependencies: string[] = [
  "@heroui/system",
  "@heroui/theme",
  "framer-motion",
  "next-themes",
];
const devDependencies: string[] = [];

const heroUIPatches = {
  "{/*heroui_provider*/}":
    'import { HeroProvider } from "@/components/hero-provider"',
  "{/*hero_provider_start*/}": "<HeroProvider>",
  "{/*hero_provider_end*/}": "</HeroProvider>",
};

export async function setupConfig(pm: PM, appDir: string): Promise<void> {
  try {
    // Copy CSS
    await cpy(join(CONFIG_DIR, "globals.css.txt"), join(appDir, "src/app"), {
      rename: "globals.css",
      overwrite: true,
    });

    // Copy Hero UI theme file
    await cpy(join(CONFIG_DIR, "hero.ts.txt"), join(appDir, "src/app"), {
      rename: "hero.ts",
    });

    // Copy provider component
    await cpy(
      join(CONFIG_DIR, "provider.tsx.txt"),
      join(appDir, "src/components"),
      {
        rename: "hero-provider.tsx",
      }
    );

    const layoutPath = join(appDir, "src/app/layout.tsx");
    await patchFile(layoutPath, heroUIPatches);

    await removeComments(layoutPath);

    await installPackages(appDir, pm, dependencies, devDependencies);

  } catch (err) {
    console.error("Hero UI setup failed:", err);
    await rimraf(appDir);
    process.exit(1);
  }
}
