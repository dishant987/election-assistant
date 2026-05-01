import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Vote, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Search,
  MessageCircle,
  ArrowRight,
  Info,
  HelpCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

interface Myth {
  id: number;
  myth: string;
  truth: string;
  explanation: string;
  category: "Security" | "Process" | "Eligibility" | "Results";
}

const myths: Myth[] = [
  {
    id: 1,
    category: "Security",
    myth: "EVMs can be hacked via Bluetooth or Wi-Fi.",
    truth: "EVMs have no wireless communication capabilities.",
    explanation: "Electronic Voting Machines are standalone units with no radio-frequency receivers. They are not connected to any network, making remote hacking impossible."
  },
  {
    id: 2,
    category: "Process",
    myth: "I can vote online using my smartphone.",
    truth: "Online voting is not currently permitted.",
    explanation: "To ensure secrecy and prevent coercion, voters must physically visit their designated polling station to cast their vote."
  },
  {
    id: 3,
    category: "Eligibility",
    myth: "If my name is not in the list, I can vote with just my Voter ID.",
    truth: "Being in the Electoral Roll is mandatory.",
    explanation: "A Voter ID card is only a proof of identity. To vote, your name must be present in the official Electoral Roll of your constituency."
  },
  {
    id: 4,
    category: "Security",
    myth: "The ink can be easily removed with chemicals.",
    truth: "Indelible ink is designed to stay for weeks.",
    explanation: "Indelible ink contains silver nitrate which reacts with the skin to form a permanent mark that only fades as the skin cells naturally renew."
  },
  {
    id: 5,
    category: "Results",
    myth: "If NOTA gets the most votes, the election is canceled.",
    truth: "The candidate with the second most votes wins.",
    explanation: "Currently, NOTA (None of the Above) acts as a symbolic protest. It does not lead to a re-election even if it receives the highest number of votes."
  },
  {
    id: 6,
    category: "Process",
    myth: "Mobile phones are allowed inside the voting compartment.",
    truth: "Mobile phones are strictly prohibited.",
    explanation: "To maintain the secrecy of the ballot and prevent voters from taking photos of their marked ballots, phones must be deposited outside."
  }
];

export const MythBusterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMyths = myths.filter(m => {
    const matchesSearch = m.myth.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? m.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Security", "Process", "Eligibility", "Results"];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Vote size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoteWise</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/chat"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-16 px-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20"
          >
            <ShieldAlert size={16} />
            Electoral Integrity
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Election <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Myth Buster</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't let misinformation cloud your judgment. We debunk the most common rumors surrounding the voting process.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search rumors or myths..."
              className="w-full pl-12 pr-6 py-4 bg-card/40 border border-border/50 rounded-2xl focus:border-primary/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Myth Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredMyths.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] overflow-hidden flex flex-col hover:border-red-500/30 transition-all shadow-xl"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.category}
                    </span>
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <XCircle size={20} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight">
                    "{item.myth}"
                  </h3>
                  
                  <div className="space-y-4 mt-8 pt-8 border-t border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-emerald-500/10 rounded-md text-emerald-500 mt-1">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-500 uppercase tracking-tighter mb-1">The Truth</p>
                        <p className="font-semibold text-foreground leading-tight">{item.truth}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pt-4">
                      <div className="p-1 bg-blue-500/10 rounded-md text-blue-500 mt-1">
                        <Info size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-500 uppercase tracking-tighter mb-1">Details</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 border-t border-border/50 flex justify-center">
                   <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <Zap size={10} className="text-orange-500" /> Source: Election Commission Guidelines
                   </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Ask AI CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-br from-primary to-blue-700 rounded-[40px] text-primary-foreground overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Have you heard a different rumor?</h2>
              <p className="text-primary-foreground/80 max-w-xl text-lg">
                Our AI is trained on official electoral data and can help you verify any claim you find online.
              </p>
            </div>
            <Link 
              to="/chat" 
              className="px-8 py-4 bg-white text-primary rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Ask AI Now <MessageCircle size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
           <div className="flex gap-6 p-8 bg-card/40 rounded-[32px] border border-border/50">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Spotting Fake News</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Always check the source of election-related messages. Official information only comes from authorized election commission channels.</p>
              </div>
           </div>
           <div className="flex gap-6 p-8 bg-card/40 rounded-[32px] border border-border/50">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ArrowRight size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Report Misinformation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Most election commissions have dedicated apps or helplines to report fake news and model code violations.</p>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Fighting misinformation with knowledge.</p>
        </div>
      </footer>
    </div>
  );
};
