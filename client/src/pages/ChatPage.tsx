import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";
import { Sidebar } from "../components/Sidebar";
import { Vote } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export const ChatPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden transition-colors duration-300">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Vote size={20} className="text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight leading-none">VoteWise</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Election Education AI</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border z-[70] md:hidden"
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Chat Area */}
          <main className="flex-1 overflow-hidden flex flex-col w-full">
            <ChatWindow />
          </main>

          {/* Input */}
          <footer className="absolute bottom-0 w-full z-10 ">
            <ChatInput />
          </footer>
        </div>
      </div>
    </div>
  );
};
