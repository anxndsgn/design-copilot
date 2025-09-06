export function AiFeedback() {
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
      <button onClick={handleClick}>get node tree</button>
    </div>
  );
}
