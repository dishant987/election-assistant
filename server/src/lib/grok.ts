type GrokMessage = { role: "system" | "user" | "assistant"; content: string };

// Groq keys start with "gsk_"; any other key is treated as an xAI Grok key.
const getProvider = () => {
  const key = process.env.GROK_API_KEY;
  if (!key) throw new Error("GROK_API_KEY is not defined");
  return key.startsWith("gsk_")
    ? { key, url: "https://api.groq.com/openai/v1/chat/completions", model: "openai/gpt-oss-120b" }
    : { key, url: "https://api.x.ai/v1/chat/completions", model: "grok-3-mini" };
};

/** Fallback LLM used when Gemini fails. Returns the full reply text (no streaming). */
export const grokComplete = async (messages: GrokMessage[], json = false): Promise<string> => {
  const { key, url, model } = getProvider();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROK_MODEL || model,
      messages,
      ...(json && { response_format: { type: "json_object" } }),
    }),
    // Last line of defence: don't let a hung fallback hold the request until the platform kills it.
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Grok API ${res.status}: ${await res.text()}`);
  const data: any = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Grok API");
  return text;
};
