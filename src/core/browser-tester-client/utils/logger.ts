import { LOG_PREFIX } from "../constants";

export const logInfo = (message: string, ...args: any) => {
  console.info(`${LOG_PREFIX}${message}`, ...args);
};

export const logWarn = (message: string, ...args: any) => {
  console.warn(`${LOG_PREFIX}${message}`, ...args);
};

export const logError = (message: string, ...args: any) => {
  console.error(`${LOG_PREFIX}${message}`, ...args);
};
