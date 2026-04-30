import type { Message } from "../types";
import ReactMarkdown from "react-markdown";
import { User, Bot, Copy, Check, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/chatStore";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isModel = message.role === "model";
  const messageLanguage = message.language || "English";
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCopy = () => {
    const text = message.parts[0].text;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReadAloud = () => {
    const text = message.parts[0].text;
    if (!text) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on message setting
      let langTag = "en-US";
      if (messageLanguage === "Hindi") langTag = "hi-IN";
      if (messageLanguage === "Gujarati") langTag = "gu-IN";

      utterance.lang = langTag;

      // Try to find a voice matching the language
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(langTag));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isModel ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${isModel ? "flex-row" : "flex-row-reverse"
          } items-start gap-3`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isModel ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
            }`}
        >
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div
            className={`relative px-5 py-3 rounded-2xl shadow-sm ${isModel
                ? "bg-secondary/40 border border-border text-foreground rounded-tl-none backdrop-blur-sm"
                : "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
              }`}
          >
            <div className="text-sm leading-relaxed">
              {message.parts[0].text ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    a: ({ children, href }) => <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  }}
                >
                  {message.parts[0].text}
                </ReactMarkdown>
              ) : (
                <div className="flex gap-1 py-1">
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>
          </div>

          {isModel && message.parts[0].text && (
            <div className="flex items-center gap-1.5 ml-1">
              {messageLanguage === "English" && (
                <button
                  onClick={handleReadAloud}
                  className={`p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 ${isPlaying ? "text-primary bg-primary/10" : ""}`}
                  title={isPlaying ? "Stop reading" : "Read aloud"}
                >
                  {isPlaying ? <VolumeX size={14} className="animate-pulse" /> : <Volume2 size={14} />}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                title="Copy to clipboard"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check size={14} className="text-emerald-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Copy size={14} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
