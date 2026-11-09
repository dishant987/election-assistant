import { parseNewsRss, parseGNews, fetchElectionNews } from "../lib/newsFeed";

describe("fetchElectionNews cache", () => {
  const article = { title: "T", description: "D", url: "https://x", image: "https://x.jpg", publishedAt: "2026-11-09T00:00:00Z", source: { name: "S" } };

  beforeEach(() => {
    process.env.GNEWS_API_KEY = "test-key";
  });
  afterEach(() => {
    delete process.env.GNEWS_API_KEY;
    jest.restoreAllMocks();
  });

  it("shares one GNews call between simultaneous requests for the same country", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ articles: [article] }), { status: 200 })
    );
    const [a, b] = await Promise.all([fetchElectionNews("CacheLand"), fetchElectionNews("cacheland")]);
    expect(a).toEqual(b);
    expect(a[0].image).toBe("https://x.jpg");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not cache failures", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockRejectedValue(new Error("offline"));
    await expect(fetchElectionNews("FailLand")).rejects.toThrow("offline");
    await expect(fetchElectionNews("FailLand")).rejects.toThrow("offline");
    // GNews + Google RSS attempted on each call: nothing was cached
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});

describe("parseGNews", () => {
  it("maps GNews articles, including the image", () => {
    const news = parseGNews({
      totalArticles: 1,
      articles: [{
        title: "EC announces poll dates",
        description: "The Election Commission announced dates for five states.",
        url: "https://example.com/a",
        image: "https://example.com/a.jpg",
        publishedAt: "2026-11-09T01:58:00Z",
        source: { name: "CNBC-TV18", url: "https://www.cnbctv18.com" },
      }],
    });
    expect(news).toEqual([{
      title: "EC announces poll dates",
      link: "https://example.com/a",
      snippet: "The Election Commission announced dates for five states.",
      source: "CNBC-TV18",
      date: "Nov 9, 2026",
      image: "https://example.com/a.jpg",
    }]);
  });

  it("handles errors or missing fields without crashing", () => {
    expect(parseGNews({ errors: ["bad key"] })).toEqual([]);
    expect(parseGNews({ articles: [{ title: "x" }] })[0]).toMatchObject({ image: null, date: "", source: "" });
  });
});

const rss = `<?xml version="1.0"?><rss><channel><title>Feed</title>
<item>
  <title>Polls open in Bihar &amp; Delhi - The Hindu</title>
  <link>https://news.google.com/articles/abc</link>
  <pubDate>Mon, 03 Nov 2025 10:00:00 GMT</pubDate>
  <description>&lt;a href="https://x"&gt;Polls open in Bihar&lt;/a&gt;&amp;nbsp;&lt;font&gt;The Hindu&lt;/font&gt;</description>
  <source url="https://www.thehindu.com">The Hindu</source>
</item>
<item><title>Second - BBC</title><link>https://b</link><pubDate>Tue, 04 Nov 2025 10:00:00 GMT</pubDate><description></description><source url="https://bbc.com">BBC</source></item>
</channel></rss>`;

describe("parseNewsRss", () => {
  it("parses items, decodes entities and strips the source suffix", () => {
    const news = parseNewsRss(rss);
    expect(news).toHaveLength(2);
    expect(news[0]).toEqual({
      title: "Polls open in Bihar & Delhi",
      link: "https://news.google.com/articles/abc",
      snippet: "Polls open in Bihar The Hindu",
      source: "The Hindu",
      date: "Nov 3, 2025",
      image: null,
    });
  });

  it("drops a snippet that only repeats the title", () => {
    expect(parseNewsRss(rss)[1].snippet).toBe("");
    const dup = rss.replace("<description></description>", "<description>Second BBC</description>");
    expect(parseNewsRss(dup)[1].snippet).toBe("");
  });

  it("respects the limit and handles an empty feed", () => {
    expect(parseNewsRss(rss, 1)).toHaveLength(1);
    expect(parseNewsRss("<rss></rss>")).toEqual([]);
  });
});
