import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, type LanguageOption } from "@/lib/store";
import {
  VISION_MODEL_OPTIONS,
  type VisionModelId,
} from "@/constants/vision-models";

export default function Settings() {
  const apiKey = useAppStore((state) => state.apiKey);
  const setApiKey = useAppStore((state) => state.setApiKey);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const visionModel = useAppStore((state) => state.visionModel);
  const setVisionModel = useAppStore((state) => state.setVisionModel);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySubmit = () => {
    parent.postMessage({ pluginMessage: { type: "set-api-key", apiKey } }, "*");
  };

  const handleLanguageChange = (value: unknown) => {
    if (typeof value === "string") {
      setLanguage(value as LanguageOption);
    }
  };

  const handleVisionModelChange = (value: unknown) => {
    if (typeof value !== "string") return;
    const matchedOption = VISION_MODEL_OPTIONS.find(
      (option) => option.id === value
    );
    if (!matchedOption) return;
    const modelId = matchedOption.id as VisionModelId;
    setVisionModel(modelId);
    parent.postMessage(
      {
        pluginMessage: { type: "set-vision-model", model: modelId },
      },
      "*"
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="password"
        placeholder="OpenRouter API key"
        value={apiKey}
        onChange={handleApiKeyChange}
        onSubmit={handleApiKeySubmit}
      />
      <Button className="w-full" onClick={handleApiKeySubmit}>
        Save
      </Button>
      <div className="flex flex-col gap-1">
        <span className="typography-body-small text-black-700 dark:text-white-700">
          Display language
        </span>
        <Select
          value={language}
          onValueChange={handleLanguageChange}
          items={[
            { value: "en", label: "English" },
            { value: "zh", label: "中文" },
          ]}
        >
          <SelectTrigger className={"w-fit"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <span className="typography-body-small text-black-700 dark:text-white-700">
          Vision model
        </span>
        <Select value={visionModel} onValueChange={handleVisionModelChange}>
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {VISION_MODEL_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <span>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
