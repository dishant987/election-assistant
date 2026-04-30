import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Languages, Check } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { id: "English", label: "English", native: "English" },
  { id: "Hindi", label: "Hindi", native: "हिन्दी" },
  { id: "Gujarati", label: "Gujarati", native: "ગુજરાતી" },
];

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-card border border-border shadow-2xl rounded-3xl p-8 max-w-md w-full overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Settings</h2>
                <p className="text-xs text-muted-foreground">Customize your experience</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Languages size={18} className="text-muted-foreground" />
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Response Language</span>
                </div>
                
                <div className="grid gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`flex items-center justify-between px-4 py-4 rounded-2xl border transition-all duration-200 ${
                        language === lang.id
                          ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5"
                          : "bg-secondary/20 border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-sm">{lang.label}</p>
                        <p className="text-[10px] opacity-70">{lang.native}</p>
                      </div>
                      {language === lang.id && (
                        <div className="p-1 bg-primary text-primary-foreground rounded-full">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                  The AI will respond in your selected language. You can still type in any language you prefer.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full px-6 py-4 rounded-2xl font-bold text-sm bg-foreground text-background hover:opacity-90 transition-all duration-200 shadow-xl"
              >
                Done
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
