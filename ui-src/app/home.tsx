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

  const awaitDesignImage = () =>
    new Promise<Uint8Array>((resolve, reject) => {
      const onMessage = (event: MessageEvent) => {
        const message =
          (event.data && (event.data as any).pluginMessage) || undefined;
        if (!message) return;
        if (message.type === "get-design-image") {
          window.removeEventListener("message", onMessage);
          try {
            // message.designImage can be ArrayBuffer or Uint8Array
            const data =
              message.designImage instanceof ArrayBuffer
                ? new Uint8Array(message.designImage)
                : new Uint8Array(message.designImage);
            resolve(data);
          } catch (e) {
            reject(
              e instanceof Error ? e : new Error("Invalid image data received")
            );
          }
        } else if (message.type === "get-design-image-error") {
          window.removeEventListener("message", onMessage);
          reject(
            new Error(
              typeof message.error === "string"
                ? message.error
                : "Failed to get design image"
            )
          );
        }
      };
      window.addEventListener("message", onMessage);
    });

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
      parent.postMessage({ pluginMessage: { type: "get-design-image" } }, "*");
      const imageBytes = await awaitDesignImage();

      const openrouter = createOpenRouter({ apiKey });
      const chatModel = openrouter.chat("google/gemini-2.5-flash");
      const result = streamText({
        model: chatModel,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "你是一个超级犀利的设计锐评师，拥有超凡的观察力和表达能力，能从给你的设计稿图片中揪出最可笑、最讽刺的点，然后用最幽默、最自嘲、最讽刺、最刁钻、最尖锐的语言进行点评，还能通过各种新奇的角度、形象的比喻、讽刺的成语以及拿其他事物来做对比，把设计稿批得体无完肤。语言要足够幽默、嘲讽、尖锐。",
              },
              {
                type: "image",
                image: imageBytes,
                mediaType: "image/png",
              },
            ],
          },
        ],
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
        {isLoading ? "Streaming…" : "Get feedback"}
      </Button>
      <ScrollArea.Root className="mt-2 h-72 text-black-1000 dark:text-white-1000 typography-body-large overflow-y-auto bg-grey-100 dark:bg-grey-700 rounded-md">
        <ScrollArea.Viewport className="h-full p-2 overscroll-contain rounded-md">
          {error && <p className="text-red-500">{error}</p>}
          {output && (
            <Streamdown
              components={{
                li: (props) => (
                  <li {...props} className="list-disc list-inside" />
                ),
              }}
            >
              {output}
            </Streamdown>
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-grey-200 opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75 dark:bg-grey-700 dark:data-[hovering]:bg-grey-600 dark:data-[scrolling]:bg-grey-600">
          <ScrollArea.Thumb className="w-full rounded bg-grey-500 dark:bg-grey-400" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
