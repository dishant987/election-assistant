import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";
import { Sidebar } from "../components/Sidebar";
import { Vote } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden transition-colors duration-300">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Vote size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">VoteWise</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Election Education AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Explore</a>
              <a href="#" className="hover:text-foreground transition-colors">Learn</a>
              <a href="#" className="hover:text-foreground transition-colors">Democracy</a>
            </nav>
            <div className="h-6 w-[1px] bg-border/50 hidden md:block" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
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
