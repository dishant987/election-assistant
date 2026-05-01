import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/chatStore";
import { Trash2, MessageSquare, PlusCircle, Settings, ChevronLeft, ChevronRight, HelpCircle, Clock, Info, Newspaper, Monitor, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "./ConfirmModal";
import { SettingsModal } from "./SettingsModal";

export const Sidebar = () => {
  const { messages, clearHistory } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 280 }}
        className={`bg-secondary/20 border-r border-border h-full flex flex-col relative transition-all duration-300 overflow-hidden hidden md:flex`}
      >
        <div className="p-6 flex flex-col h-full w-[280px]">
          <button className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mb-8">
            <PlusCircle size={20} />
            <span>New Session</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-4 mb-4">Chat History</p>
            {messages.length > 0 ? (
              <div className="px-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-background/50 border border-border rounded-xl text-sm font-medium text-foreground cursor-default group transition-all">
                  <MessageSquare size={18} className="text-primary/70" />
                  <span className="truncate flex-1">Current Session</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-muted-foreground">No history yet</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-border space-y-2">
            <Link
              to="/quiz"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <HelpCircle size={18} />
              <span>Election Quiz</span>
            </Link>
            <Link
              to="/timeline"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <Clock size={18} />
              <span>Timeline</span>
            </Link>
            <Link
              to="/process"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <Info size={18} />
              <span>Election Process</span>
            </Link>
            <Link
              to="/faq"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <HelpCircle size={18} />
              <span>Common FAQs</span>
            </Link>
            <Link
              to="/news"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <Newspaper size={18} />
              <span>Live News</span>
            </Link>
            <Link
              to="/simulator"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <Monitor size={18} />
              <span>Simulator</span>
            </Link>
            <Link
              to="/myth-buster"
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <ShieldAlert size={18} />
              <span>Myth Buster</span>
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 rounded-xl text-sm font-bold transition-all"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
            {messages.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl text-sm font-bold transition-all"
              >
                <Trash2 size={18} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-background border border-border p-1.5 rounded-r-xl shadow-xl text-muted-foreground hover:text-primary transition-all hidden md:block"
        style={{ left: isCollapsed ? 0 : 280 }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={clearHistory}
        title="Clear History"
        description="Are you sure you want to clear your current chat history? This action is permanent."
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
