import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "../lib/secrets";
import { logger } from "../lib/logger";

const router = express.Router();

router.get("/", async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: "Country is required" });
  }

  try {
    const apiKey = await getSecret("GEMINI_API_KEY");

    if (!apiKey) {
      logger.error("GEMINI_API_KEY is not defined");
      return res.status(500).json({
        error: "Gemini API not configured",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
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
      "title": "",
      "link": "",
      "snippet": "",
      "source": "",
      "date": "",
      "image": null
    }
  ]
}

Rules:
- No explanation
- No markdown
- No code blocks
- Only valid JSON
`;

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      logger.error("JSON parse error:", responseText);
      throw new Error("Invalid JSON from Gemini");
    }

    res.json({
      news: Array.isArray(data.news) ? data.news : [],
    });

  } catch (error: any) {
    logger.error("Gemini error:", error);

    res.status(500).json({
      error: "Failed to fetch news",
      details: error.message || "Unknown error",
    });
  }
});

export default router;