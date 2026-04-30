import { motion } from "framer-motion";
import { ArrowRight, Vote, CheckCircle2, Globe, Shield, MessageSquare, HelpCircle, ChevronDown, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors group"
      >
        <span className="text-lg font-semibold">{question}</span>
        <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

export const LandingPage = () => {
  const faqs = [
    {
      question: "What is VoteWise?",
      answer: "VoteWise is an AI-powered educational platform designed to help citizens understand the complex democratic election processes of different countries in an interactive, easy-to-digest format."
    },
    {
      question: "Which countries are supported?",
      answer: "Currently, we support India, USA, and UK. We are constantly expanding our knowledge base to include more democratic nations."
    },
    {
      question: "Is the information accurate?",
      answer: "We use advanced AI models trained on official election commission data and constitutional law to provide the most accurate and up-to-date information possible."
    },
    {
      question: "Is it free to use?",
      answer: "Yes, VoteWise is completely free. Our mission is to promote democratic awareness and voter education globally."
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Vote size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VoteWise</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <Link to="/quiz" className="hover:text-foreground transition-colors">Quiz</Link>
              <Link to="/timeline" className="hover:text-foreground transition-colors">Timeline</Link>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
            <ThemeToggle />
            <Link
              to="/chat"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <CheckCircle2 size={14} />
              Empowering Global Voters
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Democracy, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">
                Demystified by AI.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience an interactive journey through the world's most complex election processes. Ask questions, explore data, and become a more informed citizen.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                to="/chat"
                className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Start Chatting Now
                <ArrowRight size={20} />
              </Link>
              <a
                href="#features"
                className="w-full md:w-auto px-8 py-4 bg-secondary/50 border border-border/50 rounded-2xl text-lg font-bold hover:bg-secondary transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Feature Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="aspect-video rounded-[32px] overflow-hidden border border-border/50 shadow-2xl bg-secondary/20 backdrop-blur-3xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-50" />

              {/* Mock UI Header */}
              <div className="absolute top-0 w-full h-12 bg-background/40 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-50">VoteWise Preview</div>
              </div>

              {/* Mock Chat Content */}
              <div className="absolute inset-0 pt-20 px-8 flex flex-col gap-6">
                {/* Mock User Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="self-end max-w-[70%]"
                >
                  <div className="bg-primary px-6 py-4 rounded-3xl rounded-tr-none text-primary-foreground text-sm font-medium shadow-xl shadow-primary/20">
                    How do elections work in India?
                  </div>
                </motion.div>

                {/* Mock AI Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="self-start max-w-[80%] flex gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Vote size={20} className="text-primary" />
                  </div>
                  <div className="bg-background/60 backdrop-blur-xl border border-white/10 px-4 py-4 rounded-3xl rounded-tl-none text-sm text-foreground leading-relaxed shadow-xl">
                    Indian elections are the world's largest democratic exercise! They follow a multi-phase process managed by the Election Commission of India...
                    <div className="mt-2 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-linear-gradient-to-t from-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why VoteWise?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We combine cutting-edge technology with constitutional expertise.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="text-blue-500" />,
                title: "Global Context",
                desc: "Deep knowledge about diverse election systems from Westminster models to Presidential systems."
              },
              {
                icon: <HelpCircle className="text-primary" />,
                title: "Interactive Quiz",
                desc: "Test your knowledge with our specially curated election awareness quizzes."
              },
              {
                icon: <Clock className="text-purple-500" />,
                title: "Election Timeline",
                desc: "Explore the history and milestones of democratic processes through time."
              },
              {
                icon: <Shield className="text-emerald-500" />,
                title: "Reliable Data",
                desc: "Information sourced from official documents to ensure accuracy and neutrality."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-card border border-border/50 rounded-3xl hover:border-primary/30 transition-all group flex flex-col h-full">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about VoteWise.</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Vote size={18} className="text-primary" />
            <span className="font-bold text-foreground">VoteWise</span>
            <span>© 2026. Built for Democracy.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
