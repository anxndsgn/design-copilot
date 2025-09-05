import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <main className="p-5 flex flex-col gap-4">
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <Button variant="outline">Click me</Button>
      <Button variant="secondary">Click me</Button>
      <Button variant="ghost">Click me</Button>
      <Button variant="link">Click me</Button>
      <Input type="text" placeholder="Enter your name" />
    </main>
  );
}

export default App;
