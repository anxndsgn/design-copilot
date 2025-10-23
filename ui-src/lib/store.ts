import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LanguageOption = "en" | "zh";

type AppState = {
  apiKey: string;
  bestDesignName: string;
  bestDesignNodeKey: string;
  answer: string;
  setApiKey: (apiKey: string) => void;
  setAnswer: (data: { answer: string; bestDesignName?: string; bestDesignNodeKey?: string }) => void;
  clearAnswer: () => void;
  language: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: "",
      bestDesignName: "",
      bestDesignNodeKey: "",
      answer: "",
      setApiKey: (apiKey) => set({ apiKey }),
      setAnswer: ({ answer, bestDesignName = "", bestDesignNodeKey = "" }) =>
        set({ answer, bestDesignName, bestDesignNodeKey }),
      clearAnswer: () => set({ answer: "", bestDesignName: "", bestDesignNodeKey: "" }),
      language: "zh",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "design-copilot-store",
    }
  )
);
