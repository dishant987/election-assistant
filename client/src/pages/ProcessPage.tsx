import { useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  ChevronLeft,
  Globe,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
  UserCheck,
  Megaphone,
  FileText,
  Calculator,
  Flag,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

interface ProcessStep {
  title: string;
  description: string;
  icon: JSX.Element;
  details: string[];
}

const electionProcesses: Record<string, ProcessStep[]> = {
  India: [
    {
      title: "Electoral Roll Preparation",
      description: "The ECI prepares and updates the list of eligible voters across the country.",
      icon: <UserCheck size={24} />,
      details: [
        "Continuous revision of electoral rolls",
        "Registration of new voters (18+)",
        "Issuance of Voter ID cards (EPIC)"
      ]
    },
    {
      title: "Election Notification",
      description: "The President or Governor issues the formal call for elections based on ECI advice.",
      icon: <FileText size={24} />,
      details: [
        "Announcement of poll dates",
        "Model Code of Conduct (MCC) comes into force",
        "Deployment of security forces planned"
      ]
    },
    {
      title: "Candidate Nomination",
      description: "Candidates file their nomination papers and provide affidavits of assets and criminal records.",
      icon: <ShieldCheck size={24} />,
      details: [
        "Filing of nomination papers with Returning Officers",
        "Scrutiny of nominations by ECI officials",
        "Period for withdrawal of nominations"
      ]
    },
    {
      title: "Election Campaigning",
      description: "Parties and candidates engage with voters to present their manifestos and promises.",
      icon: <Megaphone size={24} />,
      details: [
        "Rallies, public meetings, and door-to-door campaigning",
        "Strict adherence to the Model Code of Conduct",
        "Campaigning ends 48 hours before the close of polls"
      ]
    },
    {
      title: "Polling Day",
      description: "Citizens cast their votes at designated polling stations using Electronic Voting Machines.",
      icon: <Vote size={24} />,
      details: [
        "Use of EVMs and VVPAT for transparency",
        "Indelible ink applied to voters' fingers",
        "Strict security to ensure free and fair voting"
      ]
    },
    {
      title: "Counting & Results",
      description: "Votes are counted under strict supervision, and results are declared for each constituency.",
      icon: <Calculator size={24} />,
      details: [
        "Secure storage of EVMs in strong rooms",
        "Round-wise counting in presence of candidate agents",
        "Declaration of winner by the Returning Officer"
      ]
    }
  ],
  USA: [
    {
      title: "Primaries and Caucuses",
      description: "States hold contests to determine which candidates will receive delegates for the national convention.",
      icon: <UserCheck size={24} />,
      details: [
        "Voters choose party candidates",
        "Open vs Closed primary systems",
        "Caucus meetings for local party members"
      ]
    },
    {
      title: "National Conventions",
      description: "Major parties formally select their Presidential and Vice Presidential nominees.",
      icon: <Flag size={24} />,
      details: [
        "Delegates cast votes for the nominee",
        "Party platform is finalized",
        "Unity rallies and keynote speeches"
      ]
    },
    {
      title: "General Election Campaign",
      description: "The final nominees campaign across the country, focusing on 'swing states'.",
      icon: <Megaphone size={24} />,
      details: [
        "Presidential and Vice Presidential debates",
        "Massive advertising and fundraising",
        "Focus on the Electoral College map"
      ]
    },
    {
      title: "Election Day",
      description: "Held on the Tuesday after the first Monday in November.",
      icon: <Vote size={24} />,
      details: [
        "Voters cast ballots for their preferred candidate",
        "Popular vote determines state-wide winners",
        "Early and mail-in voting processed"
      ]
    },
    {
      title: "The Electoral College",
      description: "A group of electors chosen by each state cast the official votes for President.",
      icon: <Crown size={24} />,
      details: [
        "Total of 538 electoral votes",
        "270 votes required to win",
        "Winner-take-all system in most states"
      ]
    },
    {
      title: "Inauguration",
      description: "The newly elected President is sworn into office on January 20th.",
      icon: <ShieldCheck size={24} />,
      details: [
        "Congress certifies the electoral count",
        "Oath of office at the US Capitol",
        "Peaceful transfer of power"
      ]
    }
  ],
  UK: [
    {
      title: "Dissolution of Parliament",
      description: "The King dissolves Parliament on the advice of the Prime Minister, triggering an election.",
      icon: <Crown size={24} />,
      details: [
        "All 650 MP seats become vacant",
        "Formal 'Writs' issued for new elections",
        "Government enters 'purdah' period"
      ]
    },
    {
      title: "Candidate Nominations",
      description: "Individuals file papers to stand for election in one of the 650 constituencies.",
      icon: <FileText size={24} />,
      details: [
        "Deposit of £500 required (returned if 5% vote reached)",
        "Signature of local registered electors",
        "Official list of candidates published"
      ]
    },
    {
      title: "Campaigning",
      description: "A short and intense period where parties release manifestos and campaign locally.",
      icon: <Megaphone size={24} />,
      details: [
        "Television debates and local hustings",
        "Canvassing and leafleting in constituencies",
        "Spending limits enforced on parties and candidates"
      ]
    },
    {
      title: "Polling Day",
      description: "Voting takes place at polling stations, typically on a Thursday.",
      icon: <Vote size={24} />,
      details: [
        "First-Past-The-Post (FPTP) system used",
        "Voters mark an 'X' for one candidate",
        "Voter ID now required in person"
      ]
    },
    {
      title: "The Count",
      description: "Ballot boxes are taken to central counting halls immediately after polls close.",
      icon: <Calculator size={24} />,
      details: [
        "Verification of ballot paper counts",
        "Physical counting of votes by staff",
        "Recounts can be requested if results are close"
      ]
    },
    {
      title: "Result & Government Formation",
      description: "The candidate with the most votes in each constituency becomes the MP.",
      icon: <CheckCircle2 size={24} />,
      details: [
        "Declaration of constituency winners",
        "King invites leader of largest party to form government",
        "Majority of 326 seats required for a clear mandate"
      ]
    }
  ]
};

const countries = [
  { name: "India", flag: "🇮🇳", color: "from-orange-500 to-emerald-500", shadow: "shadow-orange-500/20" },
  { name: "USA", flag: "🇺🇸", color: "from-blue-600 to-red-600", shadow: "shadow-blue-600/20" },
  { name: "UK", flag: "🇬🇧", color: "from-blue-800 to-red-700", shadow: "shadow-indigo-800/20" },
];

export const ProcessPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = selectedCountry ? electionProcesses[selectedCountry] : [];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col">
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

      <main className="flex-1 pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedCountry ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                    Election Processes
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Discover how democracy unfolds in different parts of the world.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => {
                        setSelectedCountry(country.name);
                        setActiveStep(0);
                      }}
                      className={`group relative p-12 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[40px] overflow-hidden hover:border-primary/50 transition-all text-center flex flex-col items-center shadow-2xl ${country.shadow}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">{country.flag}</div>
                      <h3 className="text-2xl font-bold">{country.name}</h3>
                      <p className="mt-4 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Explore Process <ArrowRight size={14} className="inline ml-1" /></p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="process"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
                  >
                    <ChevronLeft size={16} />
                    Change Country
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{countries.find(c => c.name === selectedCountry)?.flag}</span>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold">{selectedCountry} Election Cycle</h2>
                      <p className="text-sm text-muted-foreground">From Preparation to Results</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[350px_1fr] gap-8 mt-12">
                  {/* Steps List */}
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group ${activeStep === index
                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                            : "bg-card/40 border-border/50 hover:border-primary/30"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeStep === index ? "bg-white/20" : "bg-secondary group-hover:bg-primary/10 transition-colors"
                          }`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-tight">{step.title}</h4>
                          <p className={`text-xs mt-1 ${activeStep === index ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            Step {index + 1}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Step Detail */}
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 md:p-12 h-full shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -mr-32 -mt-32" />

                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            {steps[activeStep].icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Phase {activeStep + 1}</span>
                            <h3 className="text-3xl md:text-4xl font-extrabold">{steps[activeStep].title}</h3>
                          </div>
                        </div>

                        <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                          {steps[activeStep].description}
                        </p>

                        <div className="space-y-6">
                          <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Info size={16} className="text-primary" />
                            Key Components
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {steps[activeStep].details.map((detail, i) => (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="flex items-start gap-3 p-4 bg-secondary/30 rounded-2xl border border-border/50"
                              >
                                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                                <span className="text-sm font-medium leading-tight">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
                          <button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary"
                          >
                            <ChevronLeft size={20} />
                            Previous
                          </button>
                          <button
                            disabled={activeStep === steps.length - 1}
                            onClick={() => setActiveStep(prev => prev + 1)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-0"
                          >
                            Next Step
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Knowledge is the foundation of democracy.</p>
        </div>
      </footer>
    </div>
  );
};
