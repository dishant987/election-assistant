import { useState, type JSX } from "react";
import { motion } from "framer-motion";
import { Vote, Calendar, MapPin, Landmark, Users, Award, Clock, Globe, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { MobileNavbar } from "../components/MobileNavbar";

interface TimelineEvent {
  year: string;
  title: string;
  location: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const timelineData: Record<string, TimelineEvent[]> = {
  India: [
    { year: "1947", title: "Independence of India", location: "India", description: "India gains independence from British rule, adopting a democratic framework.", icon: <Landmark size={24} />, color: "bg-orange-500" },
    { year: "1950", title: "Constitution Adopted", location: "India", description: "The Constitution of India comes into effect, making India a sovereign democratic republic.", icon: <Award size={24} />, color: "bg-blue-600" },
    { year: "1951-52", title: "First General Elections", location: "India", description: "World's largest democratic exercise begins with 173 million eligible voters.", icon: <Users size={24} />, color: "bg-emerald-500" },
    { year: "1989", title: "Voting Age Lowered", location: "India", description: "The 61st Amendment lowers the voting age from 21 to 18.", icon: <Clock size={24} />, color: "bg-purple-500" },
    { year: "2004", title: "EVM Implementation", location: "India", description: "Electronic Voting Machines used nationwide for the first time in general elections.", icon: <Calendar size={24} />, color: "bg-pink-500" },
    { year: "2013", title: "Introduction of NOTA", location: "India", description: "Supreme Court mandates 'None of the Above' option on ballot papers.", icon: <Vote size={24} />, color: "bg-indigo-500" },
    { year: "2014", title: "VVPAT Introduction", location: "India", description: "Voter Verifiable Paper Audit Trail used to enhance transparency in 8 constituencies.", icon: <Landmark size={24} />, color: "bg-orange-600" },
    { year: "2019", title: "Record Voter Turnout", location: "India", description: "General elections see a record turnout of 67.11%, the highest ever.", icon: <Users size={24} />, color: "bg-blue-500" }
  ],
  USA: [
    { year: "1788", title: "First US Election", location: "USA", description: "George Washington is elected as the first President of the United States.", icon: <Award size={24} />, color: "bg-blue-700" },
    { year: "1870", title: "15th Amendment", location: "USA", description: "Prohibits the denial of the right to vote based on race or color.", icon: <Landmark size={24} />, color: "bg-red-600" },
    { year: "1920", title: "19th Amendment", location: "USA", description: "Guarantees women the right to vote nationwide.", icon: <Users size={24} />, color: "bg-purple-600" },
    { year: "1965", title: "Voting Rights Act", location: "USA", description: "Historic legislation to remove discriminatory barriers at the state and local levels.", icon: <Award size={24} />, color: "bg-emerald-600" },
    { year: "1971", title: "26th Amendment", location: "USA", description: "Lowered the legal voting age from 21 to 18.", icon: <Clock size={24} />, color: "bg-orange-500" },
    { year: "1993", title: "Motor Voter Act", location: "USA", description: "Simplified voter registration by allowing it at motor vehicle departments.", icon: <Calendar size={24} />, color: "bg-blue-500" },
    { year: "2002", title: "Help America Vote Act", location: "USA", description: "Modernized voting systems and established minimum election administration standards.", icon: <Landmark size={24} />, color: "bg-indigo-600" },
    { year: "2020", title: "Record Mail-in Voting", location: "USA", description: "Massive shift to early and mail-in voting during the COVID-19 pandemic.", icon: <Vote size={24} />, color: "bg-red-500" }
  ],
  UK: [
    { year: "1832", title: "Great Reform Act", location: "UK", description: "Expanded the electorate and redistributed seats to represent industrial cities.", icon: <Landmark size={24} />, color: "bg-blue-800" },
    { year: "1918", title: "Suffrage for Women", location: "UK", description: "Representation of the People Act grants vote to women over 30 with property.", icon: <Users size={24} />, color: "bg-purple-700" },
    { year: "1928", title: "Equal Franchise Act", location: "UK", description: "Women gain electoral equality with men (voting age lowered to 21).", icon: <Award size={24} />, color: "bg-emerald-700" },
    { year: "1948", title: "End of Plural Voting", location: "UK", description: "Abolished the practice of people having multiple votes based on business or university links.", icon: <Landmark size={24} />, color: "bg-orange-600" },
    { year: "1969", title: "Voting Age Lowered", location: "UK", description: "Voting age lowered from 21 to 18 for all UK citizens.", icon: <Clock size={24} />, color: "bg-blue-600" },
    { year: "2000", title: "Electoral Commission", location: "UK", description: "Established as an independent body to oversee UK elections.", icon: <Calendar size={24} />, color: "bg-indigo-700" },
    { year: "2011", title: "Fixed-term Parliaments", location: "UK", description: "Act introduced to hold elections every five years automatically.", icon: <Clock size={24} />, color: "bg-red-700" },
    { year: "2023", title: "Voter ID Requirement", location: "UK", description: "Mandatory photo ID introduced for voting in person at UK general elections.", icon: <Award size={24} />, color: "bg-blue-700" }
  ]
};

const countries = [
  { name: "India", flag: "🇮🇳", color: "from-orange-500 to-emerald-500" },
  { name: "USA", flag: "🇺🇸", color: "from-blue-600 to-red-600" },
  { name: "UK", flag: "🇬🇧", color: "from-blue-800 to-red-700" },
];

export const TimelinePage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const events = selectedCountry ? timelineData[selectedCountry] : [];

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

      <main className="flex-1 pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-5xl mx-auto">
          {!selectedCountry ? (
            <div className="space-y-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Democratic Journey</h1>
                <p className="text-xl text-muted-foreground">Select a country to explore its historical electoral milestones.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => setSelectedCountry(country.name)}
                    className="group relative p-12 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[40px] overflow-hidden hover:border-primary/50 transition-all text-center flex flex-col items-center"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">{country.flag}</div>
                    <h3 className="text-2xl font-bold">{country.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
                >
                  <ChevronLeft size={16} />
                  Change Country
                </button>
                <div className="text-center md:text-right">
                  <h1 className="text-4xl font-extrabold tracking-tight">{selectedCountry} Milestones</h1>
                  <p className="text-muted-foreground">The evolution of voting and democracy.</p>
                </div>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 rounded-full hidden md:block" />

                <div className="space-y-12 relative">
                  {events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Content */}
                      <div className={`flex-1 w-full ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                        <div className={`p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] shadow-xl hover:border-primary/30 transition-all group`}>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${event.color} text-white`}>
                            {event.year}
                          </div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                          <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                            <MapPin size={14} />
                            {event.location}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Icon Node */}
                      <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${event.color} shadow-primary/20 transform rotate-45`}>
                          <div className="-rotate-45">{event.icon}</div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10 animate-pulse" />
                      </div>

                      {/* Spacer for md screens */}
                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mt-20 text-center">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Globe size={20} />
                  Explore Another Country
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VoteWise. Empowering citizens through knowledge.</p>
        </div>
      </footer>
    </div>
  );
};
