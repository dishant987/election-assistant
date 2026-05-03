import { useChatStore } from "../store/chatStore";
import { ChatMessage } from "./ChatMessage";
import ScrollToBottom from "react-scroll-to-bottom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * ChatWindow component renders the chat messages and a welcome screen if no country is selected.
 * It provides smooth scrolling to the bottom of the message list.
 * 
 * @returns {JSX.Element} The rendered chat window.
 */
export const ChatWindow = () => {
  const { messages, isLoading, selectedCountry } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll to bottom on new messages or loading state
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (!selectedCountry) {
    return (
      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground"
        role="region"
        aria-label="Welcome screen"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md"
        >
          <div 
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            aria-hidden="true"
          >
            <span className="text-4xl">🌍</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Election Assistant</h2>
          <p>Select a country from the list above to learn about its unique democratic election process.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ScrollToBottom 
      className="flex-1 h-full scrollbar-hide" 
      initialScrollBehavior="smooth" 
      followButtonClassName="hidden"
      role="log"
      aria-label="Chat history"
      aria-live="polite"
    >
      <div 
        className="p-4 md:p-8 flex flex-col min-h-full max-w-5xl mx-auto w-full"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </AnimatePresence>
        {/* Scroll Anchor */}
        <div 
          ref={messagesEndRef} 
          className="h-40 w-full shrink-0" 
          aria-hidden="true"
        />
      </div>
    </ScrollToBottom>
  );
};
