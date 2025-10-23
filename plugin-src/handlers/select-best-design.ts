/**
 * Selects the best design node identified by AI and adds it to the current selection
 * @param nodeKey - The node ID returned by AI
 */
export async function selectBestDesignNode(nodeKey: string) {
  try {
    if (!nodeKey) {
      figma.ui.postMessage(
        {
          type: "select-best-design-error",
          error: "No node key provided",
        },
        { origin: "*" }
      );
      return;
    }

    // Find the node by its ID using async version for dynamic-page access
    const node = await figma.getNodeByIdAsync(nodeKey);

    if (!node) {
      figma.ui.postMessage(
        {
          type: "select-best-design-error",
          error: `Node with ID ${nodeKey} not found`,
        },
        { origin: "*" }
      );
      return;
    }

    // Check if the node is a SceneNode (can be selected)
    if (!("id" in node) || node.type === "DOCUMENT" || node.type === "PAGE") {
      figma.ui.postMessage(
        {
          type: "select-best-design-error",
          error: "The node cannot be selected",
        },
        { origin: "*" }
      );
      return;
    }

    // Clear current selection and select only the best design node
    figma.currentPage.selection = [node as SceneNode];

    // Scroll to the selected node to make it visible
    figma.viewport.scrollAndZoomIntoView([node as SceneNode]);

    figma.ui.postMessage(
      {
        type: "select-best-design-success",
        nodeName: node.name,
      },
      { origin: "*" }
    );
  } catch (error) {
    figma.ui.postMessage(
      {
        type: "select-best-design-error",
        error: error instanceof Error ? error.message : "Failed to select node",
      },
      { origin: "*" }
    );
  }
}
