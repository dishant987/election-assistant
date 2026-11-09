import request from "supertest";
import { app } from "../index";
import * as geminiLib from "../lib/gemini";
import * as grokLib from "../lib/grok";

// Mock the Gemini library
jest.mock("../lib/gemini", () => ({
  ...jest.requireActual("../lib/gemini"),
  getGeminiModel: jest.fn(),
}));

jest.mock("../lib/grok", () => ({
  grokComplete: jest.fn().mockRejectedValue(new Error("Grok Error")),
}));

// Force the AI fallback path for news so the test never hits the network.
jest.mock("../lib/newsFeed", () => ({
  fetchElectionNews: jest.fn().mockResolvedValue([]),
}));

describe("Integration Tests", () => {
  describe("POST /api/chat", () => {
    it("should return a streamed response on success", async () => {
      const mockStream = {
        stream: (async function* () {
          yield { text: () => "Hello " };
          yield { text: () => "there!" };
        })(),
      };

      const mockSendMessageStream = jest.fn().mockResolvedValue(mockStream);
      const mockStartChat = jest.fn().mockReturnValue({
        sendMessageStream: mockSendMessageStream,
      });

      (geminiLib.getGeminiModel as any).mockResolvedValue({
        startChat: mockStartChat,
      });

      const res = await request(app)
        .post("/api/chat")
        .send({
          country: "india",
          messages: [{ role: "user", parts: [{ text: "Hi" }] }],
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe("Hello there!");
    });

    it("should fall back to Grok when Gemini fails", async () => {
      (geminiLib.getGeminiModel as any).mockRejectedValue(new Error("Gemini Error"));
      (grokLib.grokComplete as any).mockResolvedValueOnce("Hi from Grok");

      const res = await request(app)
        .post("/api/chat")
        .send({
          country: "india",
          messages: [{ role: "model", parts: [{ text: "Welcome" }] }, { role: "user", parts: [{ text: "Hi" }] }],
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe("Hi from Grok");
      expect((grokLib.grokComplete as any).mock.calls[0][0].map((m: any) => m.role)).toEqual(["system", "assistant", "user"]);
    });

    it("should return 500 when Gemini and Grok both fail", async () => {
      (geminiLib.getGeminiModel as any).mockRejectedValue(new Error("Gemini Error"));

      const res = await request(app)
        .post("/api/chat")
        .send({
          country: "india",
          messages: [{ role: "user", parts: [{ text: "Hi" }] }],
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Sorry, something went wrong. Please try again later.");
    });
  });

  describe("GET /api/news", () => {
    it("should return news articles on success", async () => {
      const mockNewsResponse = JSON.stringify({
        news: [
          { title: "News 1", link: "http://test.com", snippet: "Snippet 1", source: "Source 1", date: "Date 1" }
        ]
      });

      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: { text: () => mockNewsResponse }
      });

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      jest.spyOn(GoogleGenerativeAI.prototype, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent
      });

      process.env.GEMINI_API_KEY = "fake-key";

      const res = await request(app)
        .get("/api/news")
        .query({ country: "india" });

      expect(res.status).toBe(200);
      expect(res.body.news).toHaveLength(1);
      expect(res.body.news[0].title).toBe("News 1");
    });
  });
});
