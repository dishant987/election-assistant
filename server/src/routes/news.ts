import express from "express";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../lib/logger";
import { GEMINI_MODEL, GEMINI_TIMEOUT_MS } from "../lib/gemini";
import { grokComplete } from "../lib/grok";
import { fetchElectionNews } from "../lib/newsFeed";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";

const router = express.Router();

// Rate limit: 5 requests per minute for news (since it's heavier)
const newsRateLimit = rateLimit(5, 60 * 1000);

/**
 * Schema for news request validation
 */
const newsQuerySchema = z.object({
  // Fixed list (as in /api/chat): the value keys the news cache and spends GNews quota,
  // so arbitrary strings would let one client exhaust the free daily limit.
  country: z.preprocess(
    (v) => (typeof v === "string" ? v.toLowerCase() : v),
    z.enum(["india", "usa", "france", "uk", "germany"])
  ),
});

/** Asks Gemini for JSON; on any Gemini failure, asks Grok instead. */
const generateNewsJson = async (prompt: string): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel(
      { model: GEMINI_MODEL, generationConfig: { responseMimeType: "application/json" } },
      { timeout: GEMINI_TIMEOUT_MS } // not streamed, so the SDK's whole-request timeout is safe here
    );
    const text = (await model.generateContent(prompt)).response.text();
    if (!text) throw new Error("Empty response from Gemini AI");
    return text;
  } catch (error) {
    logger.warn("Gemini news failed, falling back to Grok:", error);
    return grokComplete([{ role: "user", content: prompt }], true);
  }
};

/**
 * GET /api/news
 * Real news from Google News RSS; falls back to Gemini, then Grok
 */
router.get("/", newsRateLimit, validate(newsQuerySchema, "query"), async (req, res, next) => {
  const country = req.query.country as string;

  try {
    // Real headlines first; AI-generated news is only a fallback.
    try {
      const news = await fetchElectionNews(country);
      if (news.length) return res.json({ news, timestamp: new Date().toISOString() });
    } catch (error) {
      logger.warn("News feeds failed, falling back to AI:", error);
    }

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

    const responseText = await generateNewsJson(prompt);

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