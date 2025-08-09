import type { PM } from "@/src/types";
import which from "which";
import chalk, { type ChalkInstance } from "chalk";
import { execa } from "execa";
import { readFile, writeFile } from "fs/promises";
import validateProjectName from "validate-npm-package-name";

export function validateNpmName(name: string): {
  valid: boolean;
  problems?: string[];
} {
  const nameValidation = validateProjectName(name);
  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    valid: false,
    problems: [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ],
  };
}

export function handleCancel() {
  console.log(chalk.red("\n❌ Setup cancelled by user."));
  process.exit(1);
}

const pmCmds = {
  npm: { install: ["install"], dev: ["install", "-D"] },
  pnpm: { install: ["add"], dev: ["add", "-D"] },
  yarn: { install: ["add"], dev: ["add", "-D"] },
  bun: { install: ["add"], dev: ["add", "-D"] },
};

export async function installPackages(
  dir: string,
  pm: PM,
  dep: string[] = [],
  devDep: string[] = [],
) {
  const { install, dev } = pmCmds[pm];

  if (dep.length) {
    await execa(pm, [...install, ...dep], {
      cwd: dir,
      stdio: "inherit",
    });
  }

  if (devDep.length) {
    await execa(pm, [...dev, ...devDep], {
      cwd: dir,
      stdio: "inherit",
    });
  }
}

type PatchMap = { [placeholder: string]: string };

export async function patchFile(filePath: string, patches: PatchMap) {
  let content = await readFile(filePath, "utf-8");

  for (const [placeholder, replacement] of Object.entries(patches)) {
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    content = content.replace(regex, replacement);
  }

  await writeFile(filePath, content, "utf-8");
}

export async function isPmAvailable(pm: string): Promise<boolean> {
  try {
    await which(pm);
    return true;
  } catch {
    return false;
  }
}

export async function removeComments(filePath: string) {
  let content = await readFile(filePath, "utf-8");
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  content = content.replace(/\/\*[\s\S]*?\*\//g, "");
  content = content.replace(/\/\/.*$/gm, "");
  content = content.replace(/\{\s*\}/g, "");
  content = content.replace(/\n\s*\n+/g, "\n");
  await writeFile(filePath, content, "utf-8");
}

export function styleMessage(
  message: string,
  description?: string,
  opts?: {
    messageColor?: ChalkInstance;
    descriptionColor?: ChalkInstance;
  },
) {
  const { messageColor = chalk.blue, descriptionColor = chalk.gray } =
    opts || {};

  const styledMessage = messageColor(message);
  const styledDescription = description
    ? descriptionColor(` ${description}`)
    : "";

  return styledMessage + styledDescription;
}

// TODO : handle packagemanager
