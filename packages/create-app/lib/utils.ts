import type { PM } from "@/src/types";
import chalk from "chalk";
import { execa } from "execa";
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
