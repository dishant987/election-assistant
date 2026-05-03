import request from "supertest";
import { app } from "../index";
import * as geminiLib from "../lib/gemini";

// Mock the Gemini library
jest.mock("../lib/gemini", () => ({
  getGeminiModel: jest.fn(),
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

    it("should handle Gemini errors gracefully", async () => {
      (geminiLib.getGeminiModel as any).mockRejectedValue(new Error("Gemini Error"));

      const res = await request(app)
        .post("/api/chat")
        .send({
          country: "india",
          messages: [{ role: "user", parts: [{ text: "Hi" }] }],
        });

      expect(res.status).toBe(500);
      expect(res.body.error.message).toBe("Sorry, something went wrong. Please try again later.");
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

      // Need to mock getSecret too
      const secretsLib = require("../lib/secrets");
      jest.spyOn(secretsLib, "getSecret").mockResolvedValue("fake-key");

      const res = await request(app)
        .get("/api/news")
        .query({ country: "india" });

      expect(res.status).toBe(200);
      expect(res.body.news).toHaveLength(1);
      expect(res.body.news[0].title).toBe("News 1");
    });
  });
});
