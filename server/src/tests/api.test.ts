import request from "supertest";
import { app } from "../index";

describe("Election API Endpoints", () => {
  describe("Chat API", () => {
    it("should return 400 if country is missing", async () => {
      const res = await request(app)
        .post("/api/chat")
        .send({
          messages: [{ role: "user", parts: [{ text: "Hello" }] }]
        });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 for invalid country enum", async () => {
      const res = await request(app)
        .post("/api/chat")
        .send({
          country: "russia",
          messages: [{ role: "user", parts: [{ text: "Hello" }] }]
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe("News API", () => {
    it("should return 400 if country is too short", async () => {
      const res = await request(app)
        .get("/api/news")
        .query({ country: "i" });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 if country is missing", async () => {
      const res = await request(app)
        .get("/api/news");
      
      expect(res.status).toBe(400);
    });
  });
});
