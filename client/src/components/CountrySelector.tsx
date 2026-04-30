import { useChatStore } from "../store/chatStore";
import { COUNTRIES } from "../types";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

export const CountrySelector = () => {
  const { selectedCountry, setCountry, clearHistory, messages } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-background/50 backdrop-blur-md border-b border-border/40 overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 min-w-max md:min-w-0 md:justify-center">
        <div className="flex gap-2">
          {COUNTRIES.map((country) => {
            const isActive = selectedCountry === country.id;
            return (
              <motion.button
                key={country.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCountry(country.id)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300
                  flex items-center gap-2 border whitespace-nowrap
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-secondary/40 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <span className="text-base">{country.flag}</span>
                <span>{country.label}</span>
              </motion.button>
            );
          })}
        </div>

        {messages.length > 1 && (
          <div className="flex items-center ml-auto md:ml-4 border-l border-border/50 pl-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-lg bg-secondary/40 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 border border-border/50 hover:border-destructive/20 shadow-sm"
              title="Clear History"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={clearHistory}
        title="Clear Chat History?"
        description="This will permanently delete all your messages for this session. This action cannot be undone."
      />
    </div>
  );
};
