import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";
import { COUNTRY_PROMPTS } from "../lib/countryPrompts";
import { getGeminiModel } from "../lib/gemini";

const router = Router();

// Rate limit: 10 requests per minute
const chatRateLimit = rateLimit(10, 60 * 1000);

const chatSchema = z.object({

  country: z.enum(["india", "usa", "france", "uk", "germany"]),
  language: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      parts: z.array(z.object({ text: z.string() })),
    })
  ).min(1),
});

router.post("/", chatRateLimit, validate(chatSchema), async (req, res) => {
  const { country, messages, language = "English" } = req.body;
  
  const languageInstruction = `\n\nLANGUAGE SETTING: Your response MUST be in ${language}. 
  CRITICAL: Even if the previous messages in this conversation are in a different language, you must switch NOW and respond ONLY in ${language}. 
  Do not explain the language change, just start responding in ${language}.`;

  const systemPrompt = COUNTRY_PROMPTS[country] + languageInstruction;

  try {
    const model = await getGeminiModel(systemPrompt);
    const lastMessage = messages[messages.length - 1].parts[0].text;
    
    // Gemini history must start with a 'user' message. 
    // We strip any leading 'model' messages (like the initial welcome message).
    let cleanHistory = messages.slice(0, -1);
    while (cleanHistory.length > 0 && cleanHistory[0]?.role === "model") {
      cleanHistory.shift();
    }

    const chat = model.startChat({
      history: cleanHistory.map((msg: { role: string; parts: { text: string }[] }) => ({
        role: msg.role as "user" | "model",
        parts: msg.parts,
      })),
    });

    const result = await chat.sendMessageStream(lastMessage);

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error: any) {
    console.error("Chat Error:", error);
    if (!res.headersSent) {
      if (error.status === 429 || error.message?.includes("429")) {
        res.status(429).json({ error: "Too many requests. Please wait a moment before chatting again." });
      } else {
        res.status(500).json({ error: "Sorry, something went wrong. Please try again later." });
      }
    } else {
      res.end();
    }
  }
});

export default router;
