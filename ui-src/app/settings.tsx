import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");

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
