export const getVisionModel = async () => {
  return await figma.clientStorage.getAsync("openrouter_model");
};
