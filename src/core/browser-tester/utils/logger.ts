import config from "../../../config";

export const logDebug = (message: string, ...args: any) => {
  if (!config.log.debug) {
    return;
  }
  console.log(message, ...args);
};

export const logInfo = (message: string, ...args: any) => {
  if (!config.log.info) {
    return;
  }
  console.log(message, ...args);
};

export const logWarn = (message: string, ...args: any) => {
  if (!config.log.warn) {
    return;
  }
  console.warn(message, ...args);
};

export const logError = (message: string, ...args: any) => {
  if (!config.log.error) {
    return;
  }
  console.error(message, ...args);
};
