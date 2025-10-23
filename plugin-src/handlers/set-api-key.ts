export const setApiKey = (apiKey: string) => {
  figma.clientStorage.setAsync("openrouter_api_key", apiKey);
  console.log("API key set");
};
