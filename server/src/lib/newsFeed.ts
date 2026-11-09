import { logger } from "./logger";

export type NewsItem = {
  title: string;
  link: string;
  snippet: string;
  source: string;
  date: string;
  image: string | null;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { dateStyle: "medium" });
};

const decode = (s: string) =>
  s
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const tag = (xml: string, name: string) =>
  decode(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? "");

/** Parses a Google News RSS feed into news items (Google provides no images). */
export const parseNewsRss = (xml: string, limit = 10): NewsItem[] =>
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit).map(([, item]) => {
    const source = tag(item, "source");
    // Google News titles end with " - Source"; drop it since source has its own field.
    const title = tag(item, "title").replace(new RegExp(` - ${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "");
    // description is HTML encoded inside XML, so decode once more after stripping tags
    const snippet = decode(tag(item, "description").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    return {
      title,
      link: tag(item, "link"),
      // Google's description is usually just "title source"; showing it would repeat the headline.
      snippet: snippet.startsWith(title) ? "" : snippet,
      source,
      date: formatDate(tag(item, "pubDate")),
      image: null,
    };
  });

/** Parses a GNews.io search response into news items. */
export const parseGNews = (data: any): NewsItem[] =>
  (Array.isArray(data?.articles) ? data.articles : []).map((a: any) => ({
    title: a.title ?? "",
    link: a.url ?? "",
    snippet: a.description ?? "",
    source: a.source?.name ?? "",
    date: formatDate(a.publishedAt),
    image: a.image || null,
  }));

const fetchGNews = async (country: string, apiKey: string): Promise<NewsItem[]> => {
  const q = encodeURIComponent(`${country} election`);
  const res = await fetch(
    `https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&sortby=publishedAt&apikey=${encodeURIComponent(apiKey)}`,
    { signal: AbortSignal.timeout(8000) }
  );
  // Don't include the URL in the error: it contains the API key.
  if (!res.ok) throw new Error(`GNews ${res.status}`);
  return parseGNews(await res.json());
};

const fetchGoogleNews = async (country: string): Promise<NewsItem[]> => {
  const q = encodeURIComponent(`${country} election`);
  const res = await fetch(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Google News RSS ${res.status}`);
  return parseNewsRss(await res.text());
};

const CACHE_MS = 10 * 60 * 1000;
// shortcut: in-memory, so each server instance has its own cache; move to a shared store (e.g. Vercel KV) if GNews quota still runs out.
const cache = new Map<string, { at: number; news: Promise<NewsItem[]> }>();

/**
 * Real news, cached per country for 10 minutes. GNews free tier allows ~100 requests/day and
 * rejects near-simultaneous calls (429), so identical requests share one in-flight fetch.
 */
export const fetchElectionNews = (country: string): Promise<NewsItem[]> => {
  const key = country.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.news;

  const news = fetchFreshNews(country);
  cache.set(key, { at: Date.now(), news });
  // Don't keep failures or empty results: let the next request try again.
  news.then((n) => !n.length && cache.delete(key), () => cache.delete(key));
  return news;
};

/** GNews (with images) when GNEWS_API_KEY is set, else free keyless Google News RSS. */
const fetchFreshNews = async (country: string): Promise<NewsItem[]> => {
  const apiKey = process.env.GNEWS_API_KEY;
  if (apiKey) {
    try {
      const news = await fetchGNews(country, apiKey);
      if (news.length) return news;
    } catch (error) {
      logger.warn("GNews failed, falling back to Google News RSS:", error);
    }
  }
  return fetchGoogleNews(country);
};
