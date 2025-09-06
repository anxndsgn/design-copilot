import { Button } from "@/components/ui/button";

export function Home() {
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
  return (
    <div>
      <Button onClick={handleClick}>get feedback</Button>
    </div>
  );
}
