import { Button } from "@/components/ui/button";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { useEffect, useState } from "react";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Streamdown } from "streamdown";

export default function Home() {
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "get-api-key" } }, "*");
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message =
        (event.data && (event.data as any).pluginMessage) || undefined;
      if (message?.type === "get-api-key") {
        setApiKey(message.apiKey ?? "");
        console.log("API key set", message.apiKey);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
    <div className="h-full flex flex-col">
      <Button disabled={isLoading} onClick={handleClick}>
        {isLoading ? "Streaming…" : "get feedback"}
      </Button>
      <ScrollArea.Root className="mt-2 h-64 text-black-1000 dark:text-white-1000 typography-body-medium overflow-y-auto bg-grey-100 dark:bg-grey-700 rounded-md">
        <ScrollArea.Viewport className="h-full p-2 overscroll-contain rounded-md">
          {error && <p className="text-red-500">{error}</p>}
          {output && <Streamdown>{output}</Streamdown>}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-grey-200 opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75 dark:bg-grey-700 dark:data-[hovering]:bg-grey-600 dark:data-[scrolling]:bg-grey-600">
          <ScrollArea.Thumb className="w-full rounded bg-grey-500 dark:bg-grey-400" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
