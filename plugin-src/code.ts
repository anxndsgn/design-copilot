import { getApiKey } from "./handlers/get-api-key";
import { setApiKey } from "./handlers/set-api-key";
import { getDesignImage } from "./handlers/get-image";

figma.showUI(__html__, { themeColors: true, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "set-api-key") {
    setApiKey(msg.apiKey);
  } else if (msg.type === "get-api-key") {
    const apiKey = await getApiKey();
    figma.ui.postMessage({ type: "get-api-key", apiKey }, { origin: "*" });
  } else if (msg.type === "get-design-image") {
    getDesignImage();
  }
};
