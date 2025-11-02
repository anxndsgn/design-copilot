import { create } from "zustand";
import type { VisionModelId } from "@/constants/vision-models";

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
  visionModel: VisionModelId;
  setVisionModel: (model: VisionModelId) => void;
};

export const useAppStore = create<AppState>()((set) => ({
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
  visionModel: "google/gemini-2.5-flash",
  setVisionModel: (model) => set({ visionModel: model }),
}));
