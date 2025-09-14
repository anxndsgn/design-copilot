export async function getDesignImages() {
  const selection = figma.currentPage.selection;
  if (!selection.length) {
    figma.ui.postMessage(
      {
        type: "get-design-image-error",
        error: "No selection found. Please select at least one layer or frame.",
      },
      { origin: "*" },
    );
    return;
  }
  try {
    const designImages = await Promise.all(
      selection.map((node) =>
        node.exportAsync({
          format: "PNG",
        }),
      ),
    );
    figma.ui.postMessage(
      { type: "get-design-image", designImages },
      { origin: "*" },
    );
  } catch (err) {
    figma.ui.postMessage(
      {
        type: "get-design-image-error",
        error: err instanceof Error ? err.message : "Failed to export image.",
      },
      { origin: "*" },
    );
  }
}
