export const getApiKey = async () => {
  return await figma.clientStorage.getAsync("openrouter_api_key");
};
