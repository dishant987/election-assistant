import request from "supertest";
import { app } from "../index";

describe("Chat API", () => {
  it("should return 400 if country is missing", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", parts: [{ text: "Hello" }] }]
      });
    
    expect(res.status).toBe(400);
  });

  it("should return 400 if messages are empty", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        country: "india",
        messages: []
      });
    
    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid country", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({
        country: "invalid-country",
        messages: [{ role: "user", parts: [{ text: "Hello" }] }]
      });
    
    expect(res.status).toBe(400);
  });
});
