export async function aiFeedbackHandler() {
  try {
    const difyApiKey = await figma.clientStorage.getAsync("dify_api_key");
    const difyWorkflowId =
      await figma.clientStorage.getAsync("dify_workflow_id");

    if (!difyApiKey || !difyWorkflowId) {
      figma.notify("Please set Dify API Key and Workflow ID in clientStorage");
      return;
    }

    if (figma.currentPage.selection.length === 0) {
      figma.notify("Select a node to export before requesting feedback");
      return;
    }

    const selection = figma.currentPage.selection[0];

    const imageBytes = await selection.exportAsync({
      format: "PNG",
    });

    const fileId = await uploadImageToDify(imageBytes, difyApiKey);
    if (!fileId) {
      figma.notify("Image upload failed");
      return;
    }

    const feedback = await runWorkflowWithImage({
      apiKey: difyApiKey,
      workflowId: difyWorkflowId,
      fileId,
    });

    const message =
      typeof feedback === "string" ? feedback : JSON.stringify(feedback);
    figma.ui.postMessage({ type: "ai-feedback", payload: message });
    figma.notify("AI feedback received");
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    figma.notify(`AI feedback error: ${errMsg}`);
    console.error("AI feedback error", error);
    figma.ui.postMessage({ type: "ai-error", payload: errMsg });
  }
}

async function uploadImageToDify(
  imageBytes: Uint8Array,
  apiKey: string
): Promise<string | null> {
  const boundary = `----figma-${Math.random().toString(36).slice(2)}`;
  function encodeAscii(s: string): Uint8Array {
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
      out[i] = s.charCodeAt(i) & 0xff;
    }
    return out;
  }

  function concat(parts: Uint8Array[]): Uint8Array {
    let total = 0;
    for (const p of parts) total += p.byteLength;
    const result = new Uint8Array(total);
    let offset = 0;
    for (const p of parts) {
      result.set(p, offset);
      offset += p.byteLength;
    }
    return result;
  }

  const CRLF = "\r\n";
  const preamble = encodeAscii(
    `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="selection.png"${CRLF}` +
      `Content-Type: image/png${CRLF}${CRLF}`
  );
  const fileEnding = encodeAscii(`${CRLF}--${boundary}${CRLF}`);
  const typePart = encodeAscii(
    `Content-Disposition: form-data; name="type"${CRLF}${CRLF}image${CRLF}` +
      `--${boundary}--${CRLF}`
  );

  const body = concat([preamble, imageBytes, fileEnding, typePart]);

  const res = await fetch(`${baseURL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const json: any = await res.json();
  let fileId: string | null = null;
  if (json && typeof json === "object") {
    if ((json as any).id) {
      fileId = (json as any).id as string;
    } else if ((json as any).data && (json as any).data.id) {
      fileId = (json as any).data.id as string;
    } else if ((json as any).result && (json as any).result.id) {
      fileId = (json as any).result.id as string;
    }
  }
  return fileId;
}

async function runWorkflowWithImage(params: {
  apiKey: string;
  workflowId: string;
  fileId: string;
}): Promise<unknown> {
  const { apiKey, workflowId, fileId } = params;

  const body = {
    workflow_id: workflowId,
    inputs: {
      lang: "chinese",
      pic: {
        type: "image",
        transfer_method: "local_file",
        upload_file_id: fileId,
      },
    },
    response_mode: "blocking",
    user: "figma-plugin",
  };

  const res = await fetch(`${baseURL}/workflows/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Workflow failed: ${res.status} ${text}`);
  }

  const json: any = await res.json();

  let outputText: unknown = null;
  if (json && typeof json === "object") {
    const j: any = json;
    if (j.data && j.data.outputs && j.data.outputs.text) {
      outputText = j.data.outputs.text;
    } else if (j.outputs && j.outputs.text) {
      outputText = j.outputs.text;
    } else if (j.data && j.data.outputs && j.data.outputs.answer) {
      outputText = j.data.outputs.answer;
    } else if (j.outputs && j.outputs.answer) {
      outputText = j.outputs.answer;
    } else if (j.data && j.data.output_text) {
      outputText = j.data.output_text;
    } else if (j.output_text) {
      outputText = j.output_text;
    }
  }

  return outputText !== null && outputText !== undefined ? outputText : json;
}

const baseURL = "https://api.dify.ai/v1";
