import express from "express";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "../lib/secrets";
import { logger } from "../lib/logger";
import { validate } from "../middleware/validate";

const router = express.Router();

/**
 * Schema for news request validation
 */
const newsQuerySchema = z.object({
  country: z.string().min(2).max(50),
});

/**
 * GET /api/news
 * Fetches latest election news using Gemini AI
 */
router.get("/", validate(newsQuerySchema, "query"), async (req, res, next) => {
  const country = req.query.country as string;

  try {
    const apiKey = await getSecret("GEMINI_API_KEY");

    if (!apiKey) {
      logger.error("GEMINI_API_KEY is not defined");
      return res.status(500).json({
        error: { message: "Gemini API not configured", code: "CONFIG_ERROR" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using stable version
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Give exactly 10 latest election-related news articles for ${country}.
Return strictly in JSON format:
{
  "news": [
    {
      "title": "Clear headline",
      "link": "https://example.com",
      "snippet": "Short summary",
      "source": "News agency",
      "date": "Relative or absolute date",
      "image": null
    }
  ]
}
Rules: No markdown, only valid JSON, focused on current election events.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Empty response from Gemini AI");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      logger.error("JSON parse error:", responseText);
      throw new Error("Invalid response format from AI");
    }

    res.json({
      news: Array.isArray(data.news) ? data.news : [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error("News Fetch Error:", error);
    next(error); // Pass to global error handler
  }
});

export default router;