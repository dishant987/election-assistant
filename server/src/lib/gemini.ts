import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

// gemini-flash-latest / 3.8-flash hung with no reply (Nov 2026); 3.5-flash answers in ~5s.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

// How long to wait for Gemini to start answering before failing over to Grok.
export const GEMINI_TIMEOUT_MS = 20_000;

/** Rejects if `promise` does not settle within `ms`, so a hung request can fail over. */
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Gemini timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

let genAI: GoogleGenerativeAI | null = null;

const initializeGenAI = async () => {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not defined in environment");
    throw new Error("GEMINI_API_KEY is not defined");
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGeminiModel = async (systemInstruction: string) => {
  try {
    const ai = await initializeGenAI();
    return ai.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction,
    });
  } catch (error) {
    logger.error("Failed to get Gemini model:", error);
    throw error;
  }
};
