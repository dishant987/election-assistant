import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Vote, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

/**
 * MobileNavbar component provides a responsive navigation menu for small screens.
 * It features a slide-down overlay with navigation links and a theme toggle.
 * 
 * @returns {JSX.Element} The rendered mobile navbar.
 */
export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Quiz", href: "/quiz" },
    { name: "Timeline", href: "/timeline" },
    { name: "Process", href: "/process" },
    { name: "Live News", href: "/news" },
    { name: "Simulator", href: "/simulator" },
    { name: "Myth Buster", href: "/myth-buster" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-foreground hover:bg-secondary/80 rounded-xl transition-all"
        aria-label="Open Menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-background z-[10000] flex flex-col h-screen"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20" aria-hidden="true">
                  <Vote size={18} className="text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">VoteWise</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-xl transition-all"
                aria-label="Close Menu"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Links Section */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-background">
              <nav className="flex flex-col gap-0.5" aria-label="Mobile site links">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      if (link.href.includes("#")) {
                        const id = link.href.split("#")[1];
                        setTimeout(() => {
                          const element = document.getElementById(id);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }, 100);
                      }
                    }}
                    className="flex items-center justify-between w-full p-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-background mt-auto">
              <div className="flex items-center justify-between px-4 py-3 mb-4 bg-secondary/50 border border-border/50 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm"
                aria-label="Start chatting with AI assistant"
              >
                Start Chatting Now
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
