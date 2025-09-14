export async function getDesignImages() {
  const selection = figma.currentPage.selection;
  if (!selection || selection.length === 0) {
    figma.ui.postMessage(
      {
        type: "get-design-images-error",
        error: "No selection found. Please select one or more frames.",
      },
      { origin: "*" }
    );
    return;
  }

  try {
    const images = await Promise.all(
      selection.map(async (node) => {
        const image = await node.exportAsync({
          format: "PNG",
          constraint: {
            type: "SCALE",
            value: 2,
          },
        });
        return { image, imageName: node.name || "", nodeKey: node.id } as const;
      })
    );

    figma.ui.postMessage(
      { type: "get-design-images", images },
      { origin: "*" }
    );
  } catch (err) {
    figma.ui.postMessage(
      {
        type: "get-design-images-error",
        error: err instanceof Error ? err.message : "Failed to export images.",
      },
      { origin: "*" }
    );
  }
}
