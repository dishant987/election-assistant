import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Vote, 
  ChevronLeft, 
  UserCheck, 
  Fingerprint, 
  Monitor, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { MobileNavbar } from "../components/MobileNavbar";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 0, title: "Identity Verification", description: "Present your Voter ID to the First Polling Officer.", icon: <UserCheck className="w-8 h-8" /> },
  { id: 1, title: "Ink & Signature", description: "Second Officer checks your name, marks your finger with indelible ink, and takes your signature.", icon: <Fingerprint className="w-8 h-8" /> },
  { id: 2, title: "The Ballot Unit", description: "Enter the voting compartment and cast your vote on the EVM.", icon: <Monitor className="w-8 h-8" /> },
  { id: 3, title: "VVPAT Verification", description: "Verify your vote on the VVPAT screen for 7 seconds.", icon: <Vote className="w-8 h-8" /> },
  { id: 4, title: "Process Complete", description: "You have successfully performed your democratic duty!", icon: <CheckCircle2 className="w-8 h-8" /> },
];

export const SimulatorPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [voted, setVoted] = useState<string | null>(null);
  const [showInk, setShowInk] = useState(false);

  const parties = [
    { id: "a", name: "Democratic Party", symbol: "☀", color: "bg-orange-500" },
    { id: "b", name: "Unity Alliance", symbol: "🖐", color: "bg-blue-500" },
    { id: "c", name: "Progressive Front", symbol: "🌾", color: "bg-emerald-500" },
    { id: "d", name: "People's Choice", symbol: "⚖", color: "bg-purple-500" },
    { id: "nota", name: "NOTA", symbol: "✖", color: "bg-gray-500" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleVote = (partyName: string) => {
    setVoted(partyName);
    // Beep sound simulation would go here
    setTimeout(() => {
      nextStep();
    }, 1500);
  };

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

      <main className="flex-1 pt-32 pb-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
            Voting Simulator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the journey of a voter inside a polling station. Practice makes perfect democracy.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-16 flex justify-between max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                  idx <= currentStep ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {idx < currentStep ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{idx + 1}</span>}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-2 hidden md:block ${idx <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Simulation Area */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 h-full flex flex-col items-center text-center"
            >
              <div className="p-6 bg-primary/10 rounded-3xl text-primary mb-8">
                {steps[currentStep].icon}
              </div>
              
              <h2 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground text-lg mb-12 max-w-lg">
                {steps[currentStep].description}
              </p>

              {/* Step Specific Interactions */}
              <div className="flex-1 w-full flex flex-col items-center justify-center">
                
                {/* Step 0: Verification */}
                {currentStep === 0 && (
                  <div className="space-y-6 w-full max-w-sm">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="p-6 bg-secondary/50 rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center gap-4 cursor-pointer"
                      onClick={nextStep}
                    >
                      <ShieldCheck size={48} className="text-primary" />
                      <p className="font-bold">Tap to present your ID Card</p>
                    </motion.div>
                    <div className="flex items-center gap-3 p-4 bg-primary/10 text-primary rounded-xl text-sm border border-primary/20">
                      <AlertCircle size={18} />
                      <p className="text-left font-medium">Wait for the officer to verify your name in the electoral roll.</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Ink */}
                {currentStep === 1 && (
                  <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                      <motion.div 
                        animate={showInk ? { scale: [1, 1.1, 1] } : {}}
                        className={`w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center overflow-hidden border-2 ${showInk ? "border-indigo-500" : "border-border"}`}
                      >
                        {showInk ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-1.5 h-6 bg-indigo-700 rounded-full animate-bounce" />
                             <span className="text-xs font-bold text-indigo-500">MARKED</span>
                          </div>
                        ) : (
                          <Fingerprint size={48} className="text-muted-foreground opacity-30" />
                        )}
                      </motion.div>
                      {!showInk && (
                         <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-ping opacity-75" />
                      )}
                    </div>
                    
                    {!showInk ? (
                      <button 
                        onClick={() => {
                          setShowInk(true);
                          setTimeout(nextStep, 1500);
                        }}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Apply Indelible Ink
                      </button>
                    ) : (
                      <p className="text-primary font-bold animate-pulse text-xl">Verification Complete ✓</p>
                    )}
                  </div>
                )}

                {/* Step 2: Voting (The EVM) */}
                {currentStep === 2 && (
                  <div className="w-full max-w-2xl bg-slate-800 rounded-3xl p-6 shadow-2xl border-4 border-slate-700">
                    <div className="flex items-center justify-between mb-6 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Ready to Vote</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Electronic Voting Machine v4.0</div>
                    </div>
                    
                    <div className="space-y-3">
                      {parties.map((party) => (
                        <div key={party.id} className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl border border-slate-600 group">
                          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl shadow-inner">
                            {party.symbol}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-white font-bold">{party.name}</div>
                            <div className="text-slate-400 text-xs uppercase tracking-tighter">Candidate #0{parties.indexOf(party) + 1}</div>
                          </div>
                          <button 
                            disabled={!!voted}
                            onClick={() => handleVote(party.name)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                              voted === party.name 
                                ? "bg-red-500 shadow-lg shadow-red-500/50" 
                                : "bg-primary hover:opacity-90 shadow-lg shadow-primary/20 active:scale-90"
                            }`}
                          >
                             <div className="w-6 h-6 bg-white/20 rounded-full" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: VVPAT */}
                {currentStep === 3 && (
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-64 h-80 bg-slate-800 rounded-2xl border-8 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col">
                      <div className="h-4 bg-slate-900 w-full" />
                      <div className="flex-1 bg-white m-4 rounded flex flex-col items-center justify-center p-6 text-slate-900 border-2 border-slate-200">
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1 }}
                        >
                          <div className="text-4xl mb-4">
                            {parties.find(p => p.name === voted)?.symbol}
                          </div>
                          <div className="text-sm font-bold text-center">
                            VOTED FOR:<br/>
                            <span className="text-lg text-primary">{voted}</span>
                          </div>
                          <div className="mt-8 text-[10px] text-slate-400 text-center font-mono uppercase">
                            SLIP #29384-ECI<br/>
                            {new Date().toLocaleDateString()}
                          </div>
                        </motion.div>
                      </div>
                      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-slate-900/80 to-transparent flex items-center justify-center">
                         <div className="w-32 h-1 bg-slate-600 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                      <Monitor size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">Slip will drop in 7 seconds</span>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete */}
                {currentStep === 4 && (
                  <div className="space-y-12">
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30"
                      >
                        <CheckCircle2 size={80} />
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-2xl font-bold shadow-lg flex items-center gap-2"
                      >
                         <Fingerprint size={20} />
                         PROUD VOTER
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">You've Made a Difference!</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        In a democracy, your vote is your voice. Share this simulator with friends to help them prepare.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        to="/chat" 
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                      >
                        Ask AI More Questions <ArrowRight size={20} />
                      </Link>
                      <button 
                        onClick={() => {
                          setCurrentStep(0);
                          setVoted(null);
                          setShowInk(false);
                        }}
                        className="px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all inline-flex items-center gap-2"
                      >
                        Try Again <LogOut size={20} className="rotate-180" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation */}
              {currentStep < 2 && (
                <div className="mt-12 flex items-center gap-4">
                  <button 
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="p-4 rounded-2xl border border-border/50 hover:bg-secondary transition-all disabled:opacity-0"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextStep}
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-card/40 border border-border/50 rounded-[32px]">
            <HelpCircle className="text-primary mb-4" />
            <h4 className="font-bold mb-2">Why Verify?</h4>
            <p className="text-xs text-muted-foreground">Identity verification ensures only eligible citizens cast their votes and prevents double-voting.</p>
          </div>
          <div className="p-6 bg-card/40 border border-border/50 rounded-[32px]">
            <Monitor className="text-primary mb-4" />
            <h4 className="font-bold mb-2">EVM Security</h4>
            <p className="text-xs text-muted-foreground">EVMs are standalone machines, not connected to any network, making them immune to hacking.</p>
          </div>
          <div className="p-6 bg-card/40 border border-border/50 rounded-[32px]">
            <Vote className="text-primary mb-4" />
            <h4 className="font-bold mb-2">Secret Ballot</h4>
            <p className="text-xs text-muted-foreground">The design of the voting compartment ensures that your choice remains completely private.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Empowering every voice, ensuring every vote.</p>
        </div>
      </footer>
    </div>
  );
};
