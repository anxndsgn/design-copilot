export function getNodeTree() {
  const selection = figma.currentPage.selection[0];

  return nodeToJson(selection);
}

function nodeToJson(node: SceneNode) {
  return JSON.stringify(node);
}
