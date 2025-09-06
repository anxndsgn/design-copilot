import { getNodeTree } from "./handlers/get-node-tree";

figma.showUI(__html__, { themeColors: true, height: 400 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "get-node-tree") {
    getNodeTree();
  }
};
