import { handleCancel, installPackages, styleMessage } from "@/lib/utils";
import type { PM } from "@/src/types";
import prompts from "prompts";
import { rimraf } from "rimraf";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import cpy from "cpy";

const CONFIG_DIR = "extra/next/app/ui/shadcn/src";

const dependencies: string[] = [
  "class-variance-authority",
  "clsx",
  "lucide-react",
  "tailwind-merge",
  "next-themes",
];
const devDependencies: string[] = ["tw-animate-css"];
export async function setupConfig(pm: PM, appDir: string): Promise<void> {
  const configFilePath = join(appDir, "components.json");
  const { theme } = await prompts(
    {
      name: "theme",
      message: styleMessage("Select a ShadCN UI theme"),
      type: "select",
      initial: 0,
      choices: [
        { title: "Neutral", value: "neutral" },
        { title: "Gray", value: "gray" },
        { title: "Zinc", value: "zinc" },
        { title: "Slate", value: "slate" },
        { title: "Stone", value: "stone" },
      ],
    },
    { onCancel: handleCancel },
  );

  try {
    await cpy(join(CONFIG_DIR, "components.json"), appDir);
    await cpy(join(CONFIG_DIR, "utils.ts.txt"), join(appDir, "lib"), {
      rename: "utils.ts",
    });

    const fileContent = await readFile(configFilePath, "utf8");
    const jsonData = JSON.parse(fileContent);
    jsonData.tailwind.baseColor = theme;
    await writeFile(configFilePath, JSON.stringify(jsonData, null, 2), "utf8");

    await installPackages(appDir, pm, dependencies, devDependencies);
  } catch (err) {
    console.error(err);
    await rimraf(appDir);
    process.exit(1);
  }
}
