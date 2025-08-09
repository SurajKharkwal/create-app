import prompts, { type PromptObject } from "prompts";
import { handleCancel, styleMessage, validateNpmName } from "@/lib/utils";
import { basename, resolve } from "path";
import type { PM } from "./types";

export type Answers = {
  appName: string;
  framework: string;
  variants: string;
  ui: string;
  database?: string;
  orm?: string;
  auth?: string;
  pm: PM;
};

export const questions: PromptObject[] = [
  {
    name: "appName",
    type: "text",
    message: styleMessage("What should be the project name?"),
    initial: "my-app",
    validate: (name) => {
      const validation = validateNpmName(basename(resolve(name)));
      if (validation.valid) {
        return true;
      }
      return "Invalid project name: " + validation.problems![0];
    },
  },
  {
    name: "pm",
    type: "select",
    message: styleMessage("Choose a package manager"),
    choices: [
      { title: "bun", value: "bun" },
      { title: "npm", value: "npm" },
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
    ],
  },
  {
    name: "framework",
    type: "select",
    message: styleMessage("Which framework do you want to use?"),
    choices: [
      { title: "Next.js", value: "next" },
      { title: "React", value: "react" },
    ],
  },
  {
    name: "variants",
    type: "select",
    message: styleMessage("Select a variant"),
    choices: (_, values) => {
      if (values.framework === "next") {
        return [
          { title: "App Router", value: "app" },
          { title: "Pages Router", value: "pages" },
        ];
      }
      if (values.framework === "react") {
        return [
          { title: "None", value: "none" },
          { title: "React Router", value: "react-router" },
          { title: "TanStack Router", value: "tanstack-router" },
        ];
      }
      return [];
    },
  },
  {
    name: "ui",
    type: "select",
    message: styleMessage("Select a UI framework"),
    choices: [
      { title: "None", value: "none" },
      { title: "Hero UI", value: "hero" },
      { title: "Shadcn UI", value: "shadcn" },
    ],
  },
  {
    name: "database",
    type: (_, values) => (values.framework === "next" ? "select" : null),
    message: styleMessage("Select a database (Next.js only)"),
    choices: [
      { title: "None", value: "none" },
      { title: "MySQL", value: "mysql" },
      { title: "SQLite", value: "sqlite" },
      { title: "MongoDB", value: "mongo" },
      { title: "Postgres", value: "postgres" },
    ],
  },
  {
    name: "orm",
    type: (_, values) => (values.framework === "next" ? "select" : null),
    message: styleMessage("Select an ORM (Next.js only)"),
    choices: [
      { title: "None", value: "none" },
      { title: "Prisma", value: "prisma" },
      { title: "Drizzle", value: "drizzle" },
    ],
  },
  {
    name: "auth",
    type: (_, values) => (values.framework === "next" ? "select" : null),
    message: styleMessage("Do you want authentication?"),
    choices: [
      { title: "None", value: "none" },
      { title: "Clerk", value: "clerk" },
    ],
  },
];

export async function promptUser() {
  const answers = (await prompts(questions, {
    onCancel: handleCancel,
  })) as Answers;

  return { ...answers };
}
