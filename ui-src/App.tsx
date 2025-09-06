import Home from "./app/home";
import Settings from "./app/settings";
import { Tab, Tabs, TabsList, TabsPanel } from "./components/ui/tabs";
import { Separator } from "./components/ui/sepatator";

function App() {
  return (
    <main className="flex flex-col bg-white-1000 dark:bg-grey-800 h-screen">
      <Tabs>
        <TabsList className={"p-2"}>
          <Tab value="home">Home</Tab>
          <Tab value="settings">Settings</Tab>
        </TabsList>
        <Separator />
        <TabsPanel value="home" className={"p-2"}>
          <Home />
        </TabsPanel>
        <TabsPanel value="settings" className={"p-2"}>
          <Settings />
        </TabsPanel>
      </Tabs>
    </main>
  );
}

export default App;
