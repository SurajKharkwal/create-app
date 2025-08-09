import { addEnv, installPackages, patchFile } from "@/lib/utils";
import type { PM } from "@/src/types";
import { rimraf } from "rimraf";
import { join } from "path";
import cpy from "cpy";

const CONFIG_DIR = "extra/next/app/auth/clerk/src";

const dependencies: string[] = ["@clerk/nextjs"];
const devDependencies: string[] = [];

const envs = [
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in",
  "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/",
  "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY=YOUR_SECRET_KEY",
  "CLERK_WEBHOOK_SIGNING_SECRET=whsec_123",
];

const clerkPatches = {
  "/*clerk_import*/": "import { ClerkProvider } from '@clerk/nextjs'",
  "/*clerk_wrapper_start*/": "<ClerkProvider>",
  "/*clerk_wrapper_end*/": "</ ClerkProvider>",
};

export async function setupConfig(pm: PM, appDir: string): Promise<void> {
  try {
    await cpy(join(CONFIG_DIR, "middleware.ts.txt"), join(appDir, "src"), {
      rename: "middleware.ts",
    });
    await cpy(
      join(CONFIG_DIR, "route.ts.txt"),
      join(appDir, "src/app/api/webhook/clerk/"),
      {
        rename: "route.ts",
      },
    );
    await cpy(
      join(CONFIG_DIR, "sign-in.tsx.txt"),
      join(appDir, "src/app/sign-in/[[...sign-in]]"),
      {
        rename: "page.tsx",
      },
    );

    await cpy(
      join(CONFIG_DIR, "sign-up.tsx.txt"),
      join(appDir, "src/app/sign-up/[[...sign-up]]"),
      {
        rename: "page.tsx",
      },
    );
    await patchFile(join(appDir, "src/app/layout.tsx"), clerkPatches);
    await addEnv(envs, join(appDir, ".env.example"));
    await installPackages(appDir, pm, dependencies, devDependencies);
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
