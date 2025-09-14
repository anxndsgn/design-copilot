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
    const names = selection.map((node) => node.name || "");
    const images = await Promise.all(
      selection.map((node) =>
        node.exportAsync({
          format: "PNG",
        })
      )
    );

    figma.ui.postMessage(
      { type: "get-design-images", images, names },
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
