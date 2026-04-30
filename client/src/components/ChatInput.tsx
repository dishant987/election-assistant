import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ArrowUp, Globe, ChevronDown, Check, Sparkles } from "lucide-react";
import { COUNTRIES } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { sendMessage, isLoading, selectedCountry, setCountry } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const countryLabel = COUNTRIES.find((c) => c.id === selectedCountry)?.label;
  const countryFlag = COUNTRIES.find((c) => c.id === selectedCountry)?.flag;

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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
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
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              selectedCountry
                ? `Ask about ${countryLabel} elections...`
                : "Select a country to start"
            }
            className="w-full px-6 py-5 bg-transparent outline-none resize-none max-h-[200px] overflow-y-auto disabled:opacity-50 text-foreground placeholder:text-muted-foreground/60 scrollbar-hide text-[15px] leading-relaxed"
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5  border border-border rounded-xl hover:bg-secondary/50 transition-all duration-200"
                >
                  <Globe size={14} className="text-primary/70" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {selectedCountry ? `${countryFlag} ${countryLabel}` : "Country"}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-[100]"
                    >
                      <div className="p-2">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setCountry(c.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCountry === c.id
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>{c.label}</span>
                            </div>
                            {selectedCountry === c.id && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedCountry && (
                <div className="relative" ref={suggestionsRef}>
                  <button
                    onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
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
