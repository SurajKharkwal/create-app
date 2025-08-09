import type { PM } from "@/src/types";
import which from "which";
import chalk, { type ChalkInstance } from "chalk";
import { execa } from "execa";
import { readFile, writeFile } from "fs/promises";
import validateProjectName from "validate-npm-package-name";
import { resolve } from "path";
import { appendFile } from "fs/promises";

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

const pmExecMap: Record<PM, string> = {
  npm: "npx",
  pnpm: "pnpm",
  yarn: "yarn",
  bun: "bunx",
};

export async function runCommand(
  dir: string,
  pm: PM,
  args: string[],
  inheritLogs = true,
) {
  const execBin = pmExecMap[pm];
  await execa(execBin, args, {
    cwd: dir,
    stdio: inheritLogs ? "inherit" : "pipe",
  });
}

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
  // Read the file content
  let content = await readFile(filePath, "utf-8");

  // Replace all placeholders
  for (const [placeholder, replacement] of Object.entries(patches)) {
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    content = content.replace(regex, replacement);
  }

  // Write updated content (overwrites or new file)
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

export async function addEnv(envs: string[], file: string) {
  const filePath = resolve(file);
  const content = envs.map((e) => `${e}\n`).join("");
  await appendFile(filePath, content, "utf-8");
}

// TODO : handle packagemanager
