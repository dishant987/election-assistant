import { grokStream } from "../lib/grok";

/** Builds a fetch Response whose body arrives in the given network chunks. */
const streamResponse = (chunks: string[]) =>
  new Response(
    new ReadableStream({
      start(controller) {
        for (const c of chunks) controller.enqueue(new TextEncoder().encode(c));
        controller.close();
      },
    }),
    { status: 200 }
  );

const event = (text: string) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;

describe("grokStream", () => {
  beforeEach(() => {
    process.env.GROK_API_KEY = "gsk_test";
  });
  afterEach(() => {
    delete process.env.GROK_API_KEY;
    jest.restoreAllMocks();
  });

  it("yields text pieces in order, even when an event is split across chunks", async () => {
    const all = event("Hello") + event(" world") + ": keep-alive\n\n" + "data: [DONE]\n\n";
    const cut = all.indexOf("world") ; // split mid-JSON of the second event
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(streamResponse([all.slice(0, cut), all.slice(cut)]));

    const pieces: string[] = [];
    for await (const p of grokStream([{ role: "user", content: "Hi" }])) pieces.push(p);

    expect(pieces).toEqual(["Hello", " world"]);
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string).stream).toBe(true);
  });

  it("throws on an API error so the route can return an error response", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(new Response("bad key", { status: 401 }));
    const run = async () => {
      for await (const _ of grokStream([{ role: "user", content: "Hi" }])) void _;
    };
    await expect(run()).rejects.toThrow("Grok API 401");
  });
});
