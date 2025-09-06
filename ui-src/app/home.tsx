import { Button } from "@/components/ui/button";

export function Home() {
  const handleClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-node-tree",
        },
      },
      "*"
    );
  };
  return (
    <div>
      <Button onClick={handleClick}>get node tree</Button>
    </div>
  );
}
