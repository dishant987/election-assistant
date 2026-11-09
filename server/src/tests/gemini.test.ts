import { withTimeout } from "../lib/gemini";

describe("withTimeout", () => {
  it("returns the value when the promise settles in time", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 50)).resolves.toBe("ok");
  });

  it("rejects when the promise hangs, so chat can fail over", async () => {
    await expect(withTimeout(new Promise(() => {}), 20)).rejects.toThrow("timed out");
  });
});
