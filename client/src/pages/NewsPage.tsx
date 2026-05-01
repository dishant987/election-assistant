import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  Globe,
  ExternalLink,
  RefreshCcw,
  AlertCircle,
  Newspaper,
  Calendar,
  Search,
  Timer,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ThemeToggle } from "../components/ThemeToggle";
import { COUNTRIES, type NewsItem } from "../types";

const COOLDOWN_SECONDS = 120;

const NewsSkeleton = () => (
  <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] overflow-hidden animate-pulse">
    <div className="aspect-video bg-secondary/50" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-secondary/50 rounded-full w-1/4" />
      <div className="h-6 bg-secondary/50 rounded-full w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-secondary/50 rounded-full w-full" />
        <div className="h-4 bg-secondary/50 rounded-full w-5/6" />
      </div>
    </div>
  </div>
);

const NewsCard = ({ item }: { item: NewsItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] overflow-hidden hover:border-primary/50 transition-all flex flex-col h-full shadow-xl"
  >
    <div className="relative aspect-video overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
          <Newspaper size={48} className="text-primary/40" />
        </div>
      )}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-background/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
          {item.source}
        </span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar size={12} />
        {item.date}
      </div>
      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">
        {item.snippet}
      </p>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
      >
        Read Full Article
        <ExternalLink size={14} />
      </a>
    </div>
  </motion.div>
);

export const NewsPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("india");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const timerRef = useRef<number | null>(null);

  const checkCooldown = () => {
    const lastFetch = localStorage.getItem("news_last_fetch");
    if (lastFetch) {
      const remaining = Math.ceil(COOLDOWN_SECONDS - (Date.now() - parseInt(lastFetch)) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
        return remaining;
      }
    }
    return 0;
  };

  useEffect(() => {
    const remaining = checkCooldown();
    if (remaining > 0) {
      startTimer(remaining);
      const cached = localStorage.getItem("news_cache");
      if (cached) {
        setNews(JSON.parse(cached));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      fetchNews(selectedCountry);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let current = seconds;
    setCooldown(current);

    timerRef.current = window.setInterval(() => {
      current -= 1;
      setCooldown(current);
      if (current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCooldown(0);
      }
    }, 1000);
  };

  const fetchNews = async (country: string) => {
    const remaining = checkCooldown();
    if (remaining > 0) return;

    setLoading(true);
    setNews([]); // Clear past news immediately
    setError(null);

    try {
      const countryQuery = country.charAt(0).toUpperCase() + country.slice(1);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`, {
        params: { country: countryQuery }
      });

      const newsItems = response.data.news || [];
      setNews(newsItems);

      localStorage.setItem("news_cache", JSON.stringify(newsItems));
      localStorage.setItem("news_last_fetch", Date.now().toString());
      startTimer(COOLDOWN_SECONDS);

    } catch (err: any) {
      console.error("Error fetching news:", err);
      const rawError = err.response?.data?.details || err.message || "";

      let friendlyMessage = "We couldn't reach the live news feed right now. Please try again in a few minutes.";

      if (rawError.includes("429")) {
        friendlyMessage = "The news feed is very busy right now. We've hit a temporary limit—please wait for the timer and try again.";
      } else if (rawError.includes("503") || rawError.includes("overloaded")) {
        friendlyMessage = "The AI news service is currently experiencing high demand. Please give it a moment to catch up.";
      } else if (rawError.includes("RECITATION")) {
        friendlyMessage = "Some news results were filtered for quality and accuracy. Please try selecting a specific country.";
      } else if (err.code === "ERR_NETWORK") {
        friendlyMessage = "It looks like there's a connection issue. Please check your internet and try again.";
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (id: string) => {
    if (cooldown > 0 || loading) return;
    setSelectedCountry(id);
    fetchNews(id);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Vote size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoteWise</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/chat"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                Live Election News
              </h1>
              <p className="text-xl text-muted-foreground">
                Stay updated with the latest electoral developments worldwide.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex bg-secondary/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-xl relative overflow-hidden">
                <AnimatePresence>
                  {cooldown > 0 ? (
                    <motion.div
                      key="cooldown"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-primary"
                    >
                      <Lock size={14} />
                      Ready in {cooldown}s
                    </motion.div>
                  ) : loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-primary"
                    >
                      <RefreshCcw size={14} className="animate-spin" />
                      Fetching...
                    </motion.div>
                  )}
                </AnimatePresence>

                {COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCountryChange(c.id)}
                    disabled={cooldown > 0 || loading}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${selectedCountry === c.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-secondary/50 text-muted-foreground"
                      } ${(cooldown > 0 || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    {c.label}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => <NewsSkeleton key={i} />)}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-20 px-8 bg-destructive/5 border border-destructive/20 rounded-[40px] backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-destructive relative">
                  <AlertCircle size={40} />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-destructive/20 rounded-3xl -z-10"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">News Feed Unavailable</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg font-medium max-w-md mx-auto">
                  {error}
                </p>
                <div className="flex flex-col gap-4 items-center">
                  <button
                    onClick={() => fetchNews(selectedCountry)}
                    disabled={cooldown > 0 || loading}
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                  >
                    {loading ? (
                      <RefreshCcw size={20} className="animate-spin" />
                    ) : (
                      <RefreshCcw size={20} />
                    )}
                    {cooldown > 0 ? `Wait ${cooldown}s to Refresh` : "Try Connecting Again"}
                  </button>
                  <p className="text-xs text-muted-foreground/60 italic">
                    Tip: If the error persists, try selecting a different region or checking back later.
                  </p>
                </div>
              </motion.div>
            ) : news.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32"
              >
                <Search size={64} className="mx-auto text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-bold text-muted-foreground">No news found for this region</h3>
                <p className="text-muted-foreground">Try selecting a different country or refresh the feed.</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {news.map((item, index) => (
                  <NewsCard key={index} item={item} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Staying informed is the first step to change.</p>
        </div>
      </footer>
    </div>
  );
};
