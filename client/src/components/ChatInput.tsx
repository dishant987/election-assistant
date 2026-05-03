import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ArrowUp, Sparkles } from "lucide-react";
import { COUNTRIES } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { sendMessage, isLoading, selectedCountry } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const country = COUNTRIES.find((c) => c.id === selectedCountry);
  const countryLabel = country?.label || "Select Country";

  const handleSend = () => {
    if (text.trim() && selectedCountry && !isLoading) {
      sendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pb-2">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="relative flex flex-col bg-secondary/80 dark:bg-secondary/20 backdrop-blur-2xl border border-border dark:border-border/50 rounded-[28px] shadow-2xl shadow-black/5 focus-within:bg-secondary/90 dark:focus-within:bg-secondary/30 focus-within:border-primary/20 transition-all duration-500">
          {selectedCountry && (
            <div className="absolute top-3 left-6 pointer-events-none">
              <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.3em]">
                {countryLabel}
              </span>
            </div>
          )}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Ask about election process"
            placeholder={
              selectedCountry
                ? `Ask about ${countryLabel} elections...`
                : "Select a country to start"
            }
            className={`w-full px-6 ${selectedCountry ? 'pt-8' : 'py-5'} pb-5 bg-transparent outline-none resize-none max-h-[200px] overflow-y-auto disabled:opacity-50 text-foreground placeholder:text-muted-foreground/60 scrollbar-hide text-[15px] leading-relaxed transition-all duration-300`}
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              {selectedCountry && (
                <div className="relative" ref={suggestionsRef}>
                  <button
                    onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
                    aria-label="Toggle suggestions"
                    aria-expanded={isSuggestionsOpen}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl transition-all duration-300 ${isSuggestionsOpen 
                      ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                      : "border-border hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles size={14} className={isSuggestionsOpen ? "animate-pulse" : ""} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Suggestions</span>
                  </button>

                  <AnimatePresence>
                    {isSuggestionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 w-72 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-[100]"
                      >
                        <div className="p-2 flex flex-col gap-1">
                          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-border mb-1">
                            Prompt Ideas
                          </div>
                          {COUNTRIES.find((c) => c.id === selectedCountry)?.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setText(suggestion);
                                setIsSuggestionsOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 leading-snug"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={!text.trim() || !selectedCountry || isLoading}
              aria-label="Send message"
              className={`
                p-2.5 rounded-full transition-all duration-300
                ${text.trim() && selectedCountry && !isLoading
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100 hover:scale-105"
                  : "bg-muted text-muted-foreground scale-90 opacity-40"
                }
              `}
            >
              <ArrowUp size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/60 mt-3 uppercase tracking-[0.2em] font-medium">
          Election Process Education Assistant
        </p>
      </div>
    </div>
  );
};
