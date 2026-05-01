import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Languages, Check, Globe, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { COUNTRIES } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { id: "English", label: "English", native: "English" },
  { id: "Hindi", label: "Hindi", native: "हिन्दी" },
  { id: "Gujarati", label: "Gujarati", native: "ગુજરાતી" },
];

const CustomSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  options: { id: string; label: string; flag?: string; native?: string }[]; 
  onChange: (id: string) => void;
  icon: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.id === value);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Icon size={14} className="text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</span>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-secondary/30 border rounded-2xl transition-all duration-300 ${
          isOpen ? "border-primary ring-4 ring-primary/10" : "border-white/5 hover:border-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {selected?.flag && <span className="text-xl">{selected.flag}</span>}
          <div className="text-left">
            <p className="text-sm font-bold tracking-tight">{selected?.label}</p>
            {selected?.native && <p className="text-[10px] text-muted-foreground italic">{selected.native}</p>}
          </div>
        </div>
        <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 z-20 bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden p-1.5 backdrop-blur-xl"
            >
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                    value === option.id 
                      ? "bg-primary text-primary-foreground font-bold" 
                      : "hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.flag && <span>{option.flag}</span>}
                    <span>{option.label}</span>
                  </div>
                  {value === option.id && <Check size={16} strokeWidth={3} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, selectedCountry, setCountry } = useChatStore();

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
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative bg-card/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[32px] p-8 max-w-sm w-full overflow-hidden flex flex-col"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] -z-10" />

            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-foreground">Settings</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Preferences</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <CustomSelect 
                label="Target Region"
                value={selectedCountry}
                options={COUNTRIES}
                onChange={setCountry}
                icon={Globe}
              />

              <CustomSelect 
                label="Output Language"
                value={language}
                options={LANGUAGES}
                onChange={setLanguage}
                icon={Languages}
              />

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                  The AI assistant will adjust its context and terminology based on your selected region.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-black text-sm bg-foreground text-background shadow-lg hover:opacity-90 transition-all"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
