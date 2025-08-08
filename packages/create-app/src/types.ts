export type PM = "npm" | "bun" | "yarn" | "pnpm";

export type SETUP_CONFIG = (pm: PM, appDir: string) => Promise<void>;
