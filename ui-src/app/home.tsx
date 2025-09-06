import { Button } from "@/components/ui/button";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem("openrouter_api_key") ?? "";
    } catch {
      return "";
    }
  });

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    try {
      localStorage.setItem("openrouter_api_key", value);
    } catch {
      // ignore persistence failures
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");
    try {
      if (!apiKey) {
        throw new Error(
          "OpenRouter API key is missing. Please enter it above."
        );
      }

      const openrouter = createOpenRouter({ apiKey });
      const chatModel = openrouter.chat("google/gemini-2.5-flash");
      const result = streamText({
        model: chatModel,
        prompt: "What is OpenRouter?",
        onError({ error }) {
          setError(error instanceof Error ? error.message : String(error));
        },
      });

      for await (const delta of result.textStream) {
        setOutput((prev) => prev + delta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="password"
          placeholder="Enter OpenRouter API key"
          value={apiKey}
          onChange={handleApiKeyChange}
          style={{ width: 360, padding: 8 }}
        />
      </div>
      <Button disabled={isLoading} onClick={handleClick}>
        {isLoading ? "Streaming…" : "Stream from OpenRouter"}
      </Button>
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      {output && (
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{output}</pre>
      )}
    </div>
  );
}
