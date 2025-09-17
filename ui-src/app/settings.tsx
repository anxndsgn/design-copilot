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

export default function Settings() {
  const apiKey = useAppStore((state) => state.apiKey);
  const setApiKey = useAppStore((state) => state.setApiKey);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

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
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
