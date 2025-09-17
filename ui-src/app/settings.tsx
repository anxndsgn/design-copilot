import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export default function Settings() {
  const apiKey = useAppStore((state) => state.apiKey);
  const setApiKey = useAppStore((state) => state.setApiKey);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiKeySubmit = () => {
    parent.postMessage({ pluginMessage: { type: "set-api-key", apiKey } }, "*");
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
    </div>
  );
}
