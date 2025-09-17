import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  apiKey: string;
  bestDesignName: string;
  answer: string;
  setApiKey: (apiKey: string) => void;
  setAnswer: (data: { answer: string; bestDesignName?: string }) => void;
  clearAnswer: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: "",
      bestDesignName: "",
      answer: "",
      setApiKey: (apiKey) => set({ apiKey }),
      setAnswer: ({ answer, bestDesignName = "" }) =>
        set({ answer, bestDesignName }),
      clearAnswer: () => set({ answer: "", bestDesignName: "" }),
    }),
    {
      name: "design-copilot-store",
    }
  )
);
