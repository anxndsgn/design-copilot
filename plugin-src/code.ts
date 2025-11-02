import { getApiKey } from "./handlers/get-api-key";
import { setApiKey } from "./handlers/set-api-key";
import { getDesignImages } from "./handlers/get-image";
import { selectBestDesignNode } from "./handlers/select-best-design";
import { setVisionModel } from "./handlers/set-vision-model";
import { getVisionModel } from "./handlers/get-vision-model";

figma.showUI(__html__, { themeColors: true, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "set-api-key") {
    setApiKey(msg.apiKey);
  } else if (msg.type === "get-api-key") {
    const apiKey = await getApiKey();
    figma.ui.postMessage({ type: "get-api-key", apiKey }, { origin: "*" });
  } else if (msg.type === "set-vision-model") {
    setVisionModel(msg.model);
  } else if (msg.type === "get-vision-model") {
    const model = await getVisionModel();
    figma.ui.postMessage({ type: "get-vision-model", model }, { origin: "*" });
  } else if (msg.type === "get-design-images") {
    getDesignImages();
  } else if (msg.type === "select-best-design") {
    await selectBestDesignNode(msg.nodeKey);
  }
};
