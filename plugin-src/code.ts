import { setApiKey } from "./handlers/set-api-key";

figma.showUI(__html__, { themeColors: true, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "set-api-key") {
    setApiKey(msg.apiKey);
  }
};
