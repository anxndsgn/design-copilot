export type VisionModelId =
  | "google/gemini-3-flash-preview"
  | "google/gemini-3-pro-preview"
  | "openai/gpt-5"
  | "openai/gpt-5-mini";

export type VisionModelOption = {
  id: VisionModelId;
  label: string;
  description: string;
};

export const VISION_MODEL_OPTIONS: VisionModelOption[] = [
  {
    id: "google/gemini-3-flash-preview",
    label: "Gemini 3.0 Flash",
    description:
      "Fast multimodal model from Google, suitable for iterative reviews.",
  },
  {
    id: "google/gemini-3-pro-preview",
    label: "Gemini 3.0 Pro",
    description:
      "Higher-quality Gemini model for in-depth analysis with images.",
  },
  {
    id: "openai/gpt-5",
    label: "GPT-5",
    description:
      "GPT-5 is OpenAI's most advanced model, offering major improvements in reasoning, code quality, and user experience. It is optimized for complex tasks that require step-by-step reasoning, instruction following, and accuracy in high-stakes use cases. It supports test-time routing features and advanced prompt understanding, including user-specified intent like 'think hard about this.' Improvements include reductions in hallucination, sycophancy, and better performance in coding, writing, and health-related tasks.",
  },
  {
    id: "openai/gpt-5-mini",
    label: "GPT-5 Mini",
    description:
      "GPT-5 Mini is a compact version of GPT-5, designed to handle lighter-weight reasoning tasks. It provides the same instruction-following and safety-tuning benefits as GPT-5, but with reduced latency and cost. GPT-5 Mini is the successor to OpenAI's o4-mini model.",
  },
];
