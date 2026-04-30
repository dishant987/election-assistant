import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "./secrets";
import { logger } from "./logger";

let genAI: GoogleGenerativeAI | null = null;

const initializeGenAI = async () => {
  if (genAI) return genAI;

  const apiKey = await getSecret("GEMINI_API_KEY");
  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not defined in environment or Secret Manager");
    throw new Error("GEMINI_API_KEY is not defined");
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGeminiModel = async (systemInstruction: string) => {
  const ai = await initializeGenAI();
  return ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction,
  });
};
