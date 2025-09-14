import { Button } from "@/components/ui/button";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { useEffect, useState } from "react";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { Streamdown } from "streamdown";
import { streamObject } from "ai";
import { z } from "zod";

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

  type DesignImage = { image: Uint8Array; imageName: string; nodeKey: string };

  const awaitDesignImages = () =>
    new Promise<DesignImage[]>((resolve, reject) => {
      const onMessage = (event: MessageEvent) => {
        const message =
          (event.data && (event.data as any).pluginMessage) || undefined;
        if (!message) return;
        if (message.type === "get-design-images") {
          window.removeEventListener("message", onMessage);
          try {
            // message.images contains objects: { image, imageName }
            const arr: DesignImage[] = (message.images as any[]).map((item) => {
              const raw = (item && (item.image as any)) || undefined;
              const image =
                raw instanceof ArrayBuffer
                  ? new Uint8Array(raw)
                  : new Uint8Array(raw);
              const imageName = String(item.imageName ?? "");
              const nodeKey = String(item.nodeKey ?? "");
              return { image, imageName, nodeKey };
            });
            resolve(arr);
          } catch (e) {
            reject(
              e instanceof Error ? e : new Error("Invalid image data received")
            );
          }
        } else if (message.type === "get-design-images-error") {
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
      parent.postMessage({ pluginMessage: { type: "get-design-images" } }, "*");
      const images = await awaitDesignImages();

      const openrouter = createOpenRouter({ apiKey });
      const chatModel = openrouter.chat("google/gemini-2.5-flash");
      const { partialObjectStream, object } = streamObject({
        model: chatModel,
        schema: z.object({
          bestDesignName: z.string().min(1),
          bestDesignReason: z.string().min(1),
          bestDesignNodeKey: z.string().min(1),
        }),
        // Ensure JSON-mode generation for providers via OpenRouter
        mode: "json",
        messages: [
          {
            role: "system",
            content: "你是一位专业设计评审，熟悉Apple HIG与Material Design。",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `以下给出多张按顺序排列的设计稿图片。${images.map(({ imageName }) => `图片${imageName}`).join(", ")} **这些图片可能会很相似，因为可能只调整了一些细节，请认真仔细查看其中的区别。**请：\n1) 在这些图片中选择一个你认为最好的设计；\n2) 在返回的第一行就明确指出你选择的设计稿的名字。\n3) 给出简明、有说服力的理由（从视觉层级、信息传达、留白与布局、排版一致性、对比与对齐、可读性、风格统一性等角度）；`,
              },
              ...images.map(({ image: img, imageName, nodeKey }) => ({
                type: "image" as const,
                image: img,
                mediaType: "image/png",
                name: imageName,
                nodeKey: nodeKey,
              })),
            ],
          },
        ],

        onError({ error }) {
          setError(error instanceof Error ? error.message : String(error));
        },
      });
      // Stream partial structured output as it forms
      for await (const partial of partialObjectStream) {
        if (typeof partial.bestDesignReason === "string") {
          setOutput(partial.bestDesignReason);
        }
      }
      // Ensure final object is applied
      const finalObject = await object;
      if (finalObject?.bestDesignReason) {
        setOutput(finalObject.bestDesignReason);
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
        {isLoading ? "Thinking..." : "Tell me which is better"}
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
