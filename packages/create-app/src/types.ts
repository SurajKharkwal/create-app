export type PM = "npm" | "bun" | "yarn" | "pnpm";

export type SETUP_CONFIG = (pm: PM, appDir: string) => Promise<void>;

export type SETUP_CONFIG_DB = (
  pm: PM,
  appDir: string,
  hasOrm?: boolean,
  dbProvider?: string,
) => Promise<void>;

export type SETUP_CONFIG_ORM = (
  pm: PM,
  appDir: string,
  dbProvider?: string,
) => Promise<void>;
