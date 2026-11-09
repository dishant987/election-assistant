type GrokMessage = { role: "system" | "user" | "assistant"; content: string };

// Groq keys start with "gsk_"; any other key is treated as an xAI Grok key.
const getProvider = () => {
  const key = process.env.GROK_API_KEY;
  if (!key) throw new Error("GROK_API_KEY is not defined");
  return key.startsWith("gsk_")
    ? { key, url: "https://api.groq.com/openai/v1/chat/completions", model: "openai/gpt-oss-120b" }
    : { key, url: "https://api.x.ai/v1/chat/completions", model: "grok-3-mini" };
};

/** POSTs to the OpenAI-compatible endpoint; the 30s timeout covers only the wait for response headers. */
const request = async (body: object): Promise<Response> => {
  const { key, url, model } = getProvider();
  const controller = new AbortController();
  // Don't let a hung fallback hold the request until the platform kills it.
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.GROK_MODEL || model, ...body }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Grok API ${res.status}: ${await res.text()}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
};

/** Fallback LLM used when Gemini fails. Returns the full reply text (used for JSON news). */
export const grokComplete = async (messages: GrokMessage[], json = false): Promise<string> => {
  const res = await request({ messages, ...(json && { response_format: { type: "json_object" } }) });
  const data: any = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Grok API");
  return text;
};

/** Streams the fallback reply as text pieces, parsed from the API's server-sent events. */
export async function* grokStream(messages: GrokMessage[]): AsyncGenerator<string> {
  const res = await request({ messages, stream: true });
  if (!res.body) throw new Error("Grok API returned no stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Events can be split across network chunks: only handle complete lines, keep the rest.
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const data = line.trim();
      if (!data.startsWith("data:")) continue;
      const payload = data.slice(5).trim();
      if (payload === "[DONE]") return;
      const text = JSON.parse(payload).choices?.[0]?.delta?.content;
      if (text) yield text;
    }
  }
}
