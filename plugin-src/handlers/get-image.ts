export async function getDesignImage() {
  const selection = figma.currentPage.selection[0];
  if (!selection) {
    figma.ui.postMessage(
      {
        type: "get-design-image-error",
        error: "No selection found. Please select a layer or frame.",
      },
      { origin: "*" }
    );
    return;
  }
  try {
    const designImage = await selection.exportAsync({
      format: "PNG",
    });
    figma.ui.postMessage(
      { type: "get-design-image", designImage },
      { origin: "*" }
    );
  } catch (err) {
    figma.ui.postMessage(
      {
        type: "get-design-image-error",
        error: err instanceof Error ? err.message : "Failed to export image.",
      },
      { origin: "*" }
    );
  }
}
