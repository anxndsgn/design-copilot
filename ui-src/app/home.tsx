import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Home() {
  const [apiKey, setApiKey] = useState("");
  const [workflowId, setWorkflowId] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = (event.data && (event.data as any).pluginMessage) || null;
      if (!msg) return;
      if (msg.type === "ai-feedback") {
        setFeedback(String(msg.payload || ""));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-feedback",
        },
      },
      "*"
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      parent.postMessage(
        {
          pluginMessage: {
            type: "set-api-key",
            value: apiKey,
          },
        },
        "*"
      );
      parent.postMessage(
        {
          pluginMessage: {
            type: "set-workflow-id",
            value: workflowId,
          },
        },
        "*"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Dify API Key</label>
        <input
          className="border rounded px-2 py-1"
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <label className="text-sm font-medium">Workflow ID</label>
        <input
          className="border rounded px-2 py-1"
          type="text"
          placeholder="workflow_..."
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
        />
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div> */}

      <div className="flex items-center gap-2">
        <Button onClick={handleClick}>get feedback</Button>
      </div>

      <div className="mt-2">
        <label className="text-sm font-medium">Feedback</label>
        <pre className="whitespace-pre-wrap border rounded p-2 max-h-64 overflow-auto">
          {feedback || "No feedback yet."}
        </pre>
      </div>
    </div>
  );
}
