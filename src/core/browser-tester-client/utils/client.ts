import Bowser from "bowser";
import { PlatformInfo } from "../../shared/schema/ws";

export const clientId = (() => {
  const savedClientId = localStorage.getItem("clientId");
  const clientId = savedClientId ?? Math.random().toString(32).substring(2);
  localStorage.setItem("clientId", clientId);
  return clientId;
})();

export const getPlatformInfo = (): PlatformInfo => {
  const parser = Bowser.getParser(window.navigator.userAgent);
  const os = parser.getOSName() ?? "Unknown";
  const browser = parser.getBrowserName() ?? "Unknown";
  const version = parser.getBrowserVersion() ?? "Unknown";

  return {
    os,
    browser,
    version,
    screen,
    language,
  };
};

export const getCurrentPath = () => {
  return window.location.pathname + window.location.search;
};

const screen = ((): PlatformInfo["screen"] => {
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
})();

const language = ((): PlatformInfo["language"] => {
  return window.navigator.language;
})();
