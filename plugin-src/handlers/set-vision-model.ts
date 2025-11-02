export const setVisionModel = (model: string) => {
  figma.clientStorage.setAsync("openrouter_model", model);
  console.log("Vision model set", model);
};
