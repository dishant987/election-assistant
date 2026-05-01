import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Globe,
  ArrowLeft,
  Vote
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { MobileNavbar } from "../components/MobileNavbar";
import { COUNTRIES } from "../types";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "india" | "usa" | "uk";
}

const faqs: FAQItem[] = [
  // General
  {
    category: "general",
    question: "Why is voting important?",
    answer: "Voting is the primary way for citizens to participate in their democracy. It allows you to choose representatives who reflect your values and make decisions on issues that affect your daily life, from healthcare to the economy."
  },
  {
    category: "general",
    question: "What should I bring to the polling station?",
    answer: "This varies by country, but generally, you should bring a valid form of photo identification (like a driver's license or passport) and your voter registration card if you have one. Always check your local election office requirements before heading out."
  },

  // India
  {
    category: "india",
    question: "What is an EVM with VVPAT?",
    answer: "An Electronic Voting Machine (EVM) is used to record votes. The VVPAT (Voter Verifiable Paper Audit Trail) is a machine attached to it that prints a slip with the candidate's name and symbol, allowing the voter to verify that their vote was cast correctly."
  },
  {
    category: "india",
    question: "How can I check my name in the Voter List?",
    answer: "You can check your name in the electoral roll by visiting the official National Voters' Service Portal (NVSP) or using the 'Voter Helpline' app provided by the Election Commission of India (ECI)."
  },
  {
    category: "india",
    question: "What is the minimum age to vote in India?",
    answer: "The minimum age to vote in India is 18 years, as per the 61st Amendment Act of the Constitution."
  },

  // USA
  {
    category: "usa",
    question: "How does the Electoral College work?",
    answer: "Instead of a direct popular vote, the US President is elected by 538 electors. Each state gets a certain number of electors based on its population. In most states, the candidate who wins the popular vote gets all of that state's electoral votes."
  },
  {
    category: "usa",
    question: "Do I need to register to vote every year?",
    answer: "No, once you are registered, you usually stay registered unless you move, change your name, or haven't voted in several consecutive elections. However, it's always a good idea to check your registration status before an election."
  },
  {
    category: "usa",
    question: "Can I vote by mail (Absentee Ballot)?",
    answer: "Yes, all states allow some form of absentee voting. Some states are 'all-mail' states where every registered voter is sent a ballot, while others require you to request one or provide an excuse."
  },

  // UK
  {
    category: "uk",
    question: "What is the 'First-Past-The-Post' system?",
    answer: "In the UK General Election, the candidate with the most votes in their local area (constituency) becomes the Member of Parliament (MP). They do not need a majority of the votes, just more than any other single candidate."
  },
  {
    category: "uk",
    question: "Do I need photo ID to vote in person in the UK?",
    answer: "Yes, since 2023, voters in Great Britain must show a valid form of photo ID to vote in person at polling stations for some elections, including General Elections."
  },
  {
    category: "uk",
    question: "How do I register for a proxy vote?",
    answer: "A proxy vote is when someone you trust votes on your behalf. You must apply for this in advance through your local electoral registration office, and you usually need to provide a reason why you cannot vote in person."
  }
];

const AccordionItem = ({ faq, isOpen, toggle }: { faq: FAQItem; isOpen: boolean; toggle: () => void }) => {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group transition-all"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>
          {faq.question}
        </span>
        <div className={`p-2 rounded-lg transition-all ${isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Vote size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoteWise</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/chat"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
              >
                Back to Chat
              </Link>
            </div>
            <MobileNavbar />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-bold text-primary mb-6"
            >
              <HelpCircle size={16} />
              Frequently Asked Questions
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Common Queries about <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Electoral Processes
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to the most common questions about voting, registration, and election systems across different regions.
            </motion.p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 transition-all text-lg"
              />
            </div>
            <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-xl shrink-0 overflow-x-auto scrollbar-hide max-w-full">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary"
                  }`}
              >
                All Regions
              </button>
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeCategory === c.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  <span>{c.flag}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <motion.div
            layout
            className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[40px] p-8 md:p-12 shadow-2xl"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  toggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 md:p-12 bg-gradient-to-br from-primary to-blue-700 rounded-[40px] text-primary-foreground text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">Still have questions?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto relative z-10">
              Our AI Assistant is available 24/7 to provide detailed information about election laws, dates, and processes.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all relative z-10"
            >
              <MessageSquare size={20} />
              Chat with Assistant
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Empowering every voter with clear, accurate information.</p>
        </div>
      </footer>
    </div>
  );
};
