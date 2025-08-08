import chalk from "chalk";

export const defaultValue = {
  appName: "my-app",
  framework: "next",
  database: "postgres",
  orm: "prisma",
  auth: "clerk",
  ui: "shadcn",
  packageManager: "pnpm",
};
export const questions = [
  {
    type: "text" as const,
    name: "appName",
    message: `${chalk.cyan("What is your app name?")} ${chalk.gray("(project folder)")}`,
    initial: defaultValue.appName,
    placeholder: "my-app",
  },
  {
    type: "select" as const,
    name: "framework",
    message: `${chalk.cyan("Which framework do you want to use?")} ${chalk.gray("(core tech for your app)")}`,
    choices: [
      { title: "Next.js", value: "next" },
      { title: "Tenstack Start", value: "tanstack" },
    ],
    initial: 0,
  },
  {
    type: "select" as const,
    name: "database",
    message: `${chalk.cyan("Which database do you want to use?")} ${chalk.gray("(where your data lives)")}`,
    choices: [
      { title: "PostgreSQL", value: "postgres" },
      { title: "MySQL", value: "mysql" },
      { title: "SQLite", value: "sqlite" },
      { title: "MongoDB", value: "mongodb" },
      { title: "None", value: "none" },
    ],
    initial: 0,
  },
  {
    type: "select" as const,
    name: "orm",
    message: `${chalk.cyan("Which ORM do you want to use?")} ${chalk.gray("(how you interact with your DB)")}`,
    choices: [
      { title: "Prisma", value: "prisma" },
      { title: "Drizzle", value: "drizzle" },
      { title: "None", value: "none" },
    ],
    initial: 0,
  },
  {
    type: "select" as const,
    name: "auth",
    message: `${chalk.cyan("Which authentication provider do you want to use?")} ${chalk.gray("(login system)")}`,
    choices: [
      { title: "Clerk", value: "clerk" },
      { title: "Auth.js", value: "authjs" },
      { title: "NextAuth", value: "nextauth" },
      { title: "None", value: "none" },
    ],
    initial: 0,
  },
  {
    type: "select" as const,
    name: "ui",
    message: `${chalk.cyan("Which UI library do you want to use?")} ${chalk.gray("(for styling components)")}`,
    choices: [
      { title: "shadcn/ui", value: "shadcn" },
      { title: "Hero UI", value: "hero" },
      { title: "None", value: "none" },
    ],
    initial: 0,
  },
  {
    type: "select" as const,
    name: "packageManager",
    message: `${chalk.cyan("Which package manager do you want to use?")} ${chalk.gray("(for installing dependencies)")}`,
    choices: [
      { title: "pnpm", value: "pnpm" },
      { title: "npm", value: "npm" },
      { title: "yarn", value: "yarn" },
      { title: "bun", value: "bun" },
    ],
    initial: 0,
  },
];
