import { aiFeedbackHandler } from "./handlers/ai-feedback-handler";

figma.showUI(__html__, { themeColors: true, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "get-feedback") {
    aiFeedbackHandler();
  } else if (msg.type === "set-api-key") {
    await figma.clientStorage.setAsync("dify_api_key", msg.value || "");
    figma.notify("API key saved");
  } else if (msg.type === "set-workflow-id") {
    await figma.clientStorage.setAsync("dify_workflow_id", msg.value || "");
    figma.notify("Workflow ID saved");
  }
};
