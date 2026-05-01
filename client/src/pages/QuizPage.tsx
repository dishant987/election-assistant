import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, RefreshCcw, CheckCircle2, XCircle, Vote, HelpCircle, Globe, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: Record<string, Question[]> = {
  India: [
    { id: 1, question: "Who was the first Chief Election Commissioner of India?", options: ["Sukumar Sen", "T.N. Seshan", "Sunil Arora", "S.Y. Quraishi"], correctAnswer: 0, explanation: "Sukumar Sen served as the first Chief Election Commissioner of India from 1950 to 1958." },
    { id: 2, question: "What is the maximum limit of election expenditure for a Lok Sabha constituency?", options: ["₹50 Lakh", "₹70 Lakh", "₹95 Lakh", "₹1 Crore"], correctAnswer: 2, explanation: "As of recent updates, the expenditure limit for larger Lok Sabha constituencies is ₹95 Lakh." },
    { id: 3, question: "Which article of the Indian Constitution provides for the Election Commission?", options: ["Article 324", "Article 356", "Article 370", "Article 280"], correctAnswer: 0, explanation: "Article 324 of the Indian Constitution mandates the establishment of the Election Commission." },
    { id: 4, question: "How many members are there in the Election Commission of India?", options: ["1", "2", "3", "5"], correctAnswer: 2, explanation: "The ECI currently consists of one Chief Election Commissioner and two Election Commissioners." },
    { id: 5, question: "What is the term of office for the Chief Election Commissioner?", options: ["5 years", "6 years or until 65", "4 years", "Life term"], correctAnswer: 1, explanation: "The CEC holds office for a term of 6 years or until they attain the age of 65 years, whichever is earlier." },
    { id: 6, question: "When was the first general election held in India?", options: ["1947", "1950", "1951-52", "1955"], correctAnswer: 2, explanation: "The first general elections were held between October 1951 and February 1952." },
    { id: 7, question: "What does 'NOTA' stand for in Indian elections?", options: ["None of the Above", "New Options To All", "No One To Appoint", "Never Out To All"], correctAnswer: 0, explanation: "NOTA (None of the Above) was introduced in 2013 to allow voters to not vote for any candidate." },
    { id: 8, question: "Which city is the headquarters of the Election Commission of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], correctAnswer: 1, explanation: "Nirvachan Sadan, the headquarters of the ECI, is located in New Delhi." },
    { id: 9, question: "Who appoints the Election Commissioners in India?", options: ["Prime Minister", "President", "Chief Justice", "Parliament"], correctAnswer: 1, explanation: "The President of India appoints the CEC and other Election Commissioners." },
    { id: 10, question: "Which amendment lowered the voting age from 21 to 18 in India?", options: ["42nd Amendment", "44th Amendment", "61st Amendment", "73rd Amendment"], correctAnswer: 2, explanation: "The 61st Amendment Act, 1988 lowered the voting age to 18." }
  ],
  USA: [
    { id: 1, question: "How many electoral votes are needed to win the US Presidency?", options: ["218", "270", "300", "538"], correctAnswer: 1, explanation: "A candidate needs a majority of 270 out of 538 electoral votes to win." },
    { id: 2, question: "On which day are US Presidential elections held?", options: ["First Monday of November", "First Tuesday of November", "Tuesday after first Monday in Nov", "Last Sunday of Oct"], correctAnswer: 2, explanation: "Elections are held on the Tuesday following the first Monday in November." },
    { id: 3, question: "What is the minimum age to be elected President of the USA?", options: ["25", "30", "35", "40"], correctAnswer: 2, explanation: "According to the Constitution, a person must be at least 35 years old to be President." },
    { id: 4, question: "How many years is one term for a US Senator?", options: ["2 years", "4 years", "6 years", "8 years"], correctAnswer: 2, explanation: "US Senators are elected to six-year terms." },
    { id: 5, question: "Which amendment gave women the right to vote in the USA?", options: ["15th Amendment", "19th Amendment", "21st Amendment", "26th Amendment"], correctAnswer: 1, explanation: "The 19th Amendment, ratified in 1920, granted women the right to vote." },
    { id: 6, question: "Who is second in the line of presidential succession?", options: ["Vice President", "Speaker of the House", "Secretary of State", "Chief Justice"], correctAnswer: 1, explanation: "The Speaker of the House follows the Vice President in the line of succession." },
    { id: 7, question: "How many members are in the US House of Representatives?", options: ["100", "435", "538", "450"], correctAnswer: 1, explanation: "There are 435 voting members in the House, based on state populations." },
    { id: 8, question: "What is a 'Swing State'?", options: ["A state that always votes Blue", "A state that always votes Red", "A state that could be won by either candidate", "A state with no electoral votes"], correctAnswer: 2, explanation: "Swing states (or battleground states) have similar levels of support for both parties." },
    { id: 9, question: "The 'Primary' election is used to:", options: ["Elect the President", "Choose party nominees", "Remove a candidate", "Count electoral votes"], correctAnswer: 1, explanation: "Primaries are used by political parties to select their candidate for the general election." },
    { id: 10, question: "Which amendment lowered the US voting age to 18?", options: ["15th", "19th", "24th", "26th"], correctAnswer: 3, explanation: "The 26th Amendment (1971) lowered the voting age to 18 during the Vietnam War." }
  ],
  UK: [
    { id: 1, question: "What is the maximum term of a UK Parliament?", options: ["3 years", "4 years", "5 years", "6 years"], correctAnswer: 2, explanation: "General elections must be held at least every five years." },
    { id: 2, question: "What system is used for UK General Elections?", options: ["Proportional Representation", "First-Past-The-Post", "Ranked Choice", "Two-Round System"], correctAnswer: 1, explanation: "The UK uses the First-Past-The-Post (FPTP) system for electing MPs." },
    { id: 3, question: "How many constituencies are there in the UK?", options: ["550", "600", "650", "700"], correctAnswer: 2, explanation: "There are currently 650 constituencies in the UK, each electing one MP." },
    { id: 4, question: "Who officially appoints the Prime Minister?", options: ["The Speaker", "The Electorate", "The Monarch", "The House of Lords"], correctAnswer: 2, explanation: "The King or Queen appoints the leader of the party with the most seats as PM." },
    { id: 5, question: "What is the 'Hustings'?", options: ["A voting machine", "A candidate's speech/meeting", "The counting hall", "The legal document"], correctAnswer: 1, explanation: "Hustings are meetings where candidates give speeches and answer questions from voters." },
    { id: 6, question: "What is the minimum age to stand as an MP in the UK?", options: ["18", "21", "25", "30"], correctAnswer: 0, explanation: "Since 2006, the age to stand for election to Parliament is 18." },
    { id: 7, question: "What is a 'By-election'?", options: ["An election for two seats", "An election held to fill a vacancy", "A secondary vote", "A local council vote"], correctAnswer: 1, explanation: "By-elections occur when an MP resigns, dies, or is disqualified." },
    { id: 8, question: "What is the color associated with the Conservative Party?", options: ["Red", "Yellow", "Blue", "Green"], correctAnswer: 2, explanation: "Blue is the traditional color of the Conservative Party." },
    { id: 9, question: "What is the 'Official Opposition'?", options: ["The police", "The second largest party in the Commons", "The House of Lords", "A protest group"], correctAnswer: 1, explanation: "The largest party not in government forms the Official Opposition." },
    { id: 10, question: "Who is responsible for overseeing UK elections?", options: ["The PM", "The Electoral Commission", "The BBC", "Scotland Yard"], correctAnswer: 1, explanation: "The Electoral Commission is the independent body that oversees UK elections." }
  ]
};

const countries = [
  { name: "India", flag: "🇮🇳", color: "from-orange-500 to-emerald-500" },
  { name: "USA", flag: "🇺🇸", color: "from-blue-600 to-red-600" },
  { name: "UK", flag: "🇬🇧", color: "from-blue-800 to-red-700" },
];

export const QuizPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = selectedCountry ? quizData[selectedCountry] : [];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setShowResult(false);
  };

  const selectCountry = (country: string) => {
    setSelectedCountry(country);
    resetQuiz();
  };

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
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-3xl mx-auto w-full">
          {!selectedCountry ? (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">The Election Expert Quiz</h1>
                <p className="text-muted-foreground">Select a country to test your electoral expertise</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => selectCountry(country.name)}
                    className="group relative p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] overflow-hidden hover:border-primary/50 transition-all text-center flex flex-col items-center gap-4"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="text-6xl group-hover:scale-110 transition-transform">{country.flag}</div>
                    <h3 className="text-xl font-bold">{country.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          ) : !showResult ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <ChevronLeft size={16} />
                  Change Country
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{selectedCountry}</span>
                  <div className="w-px h-4 bg-border" />
                  <div className="text-sm font-bold text-primary">Question {currentQuestion + 1} of {questions.length}</div>
                </div>
              </div>

              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              <motion.div
                key={`${selectedCountry}-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 md:p-12 shadow-2xl relative"
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <HelpCircle className="text-primary-foreground" />
                </div>

                <h2 className="text-2xl font-bold mb-8 leading-tight">
                  {questions[currentQuestion].question}
                </h2>

                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => {
                    const isCorrect = index === questions[currentQuestion].correctAnswer;
                    const isSelected = selectedOption === index;
                    const showCorrect = showExplanation && isCorrect;
                    const showWrong = showExplanation && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={selectedOption !== null}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between group
                          ${isSelected ? (isCorrect ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10") : 
                            (showCorrect ? "border-emerald-500 bg-emerald-500/10" : "border-border hover:border-primary/50 hover:bg-secondary/50")}
                          ${selectedOption !== null ? "cursor-default" : "cursor-pointer active:scale-[0.98]"}
                        `}
                      >
                        <span className="font-medium">{option}</span>
                        {showCorrect && <CheckCircle2 className="text-emerald-500" size={20} />}
                        {showWrong && <XCircle className="text-red-500" size={20} />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-8 pt-8 border-t border-border/50"
                    >
                      <div className="p-4 rounded-2xl bg-secondary/50 text-sm leading-relaxed">
                        <span className="font-bold text-primary block mb-1">Explanation:</span>
                        {questions[currentQuestion].explanation}
                      </div>
                      <button
                        onClick={handleNext}
                        className="mt-6 w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                      >
                        {currentQuestion + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                        <ArrowRight size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trophy size={48} className="text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Quiz Completed!</h2>
              <p className="text-xl text-muted-foreground mb-8">
                You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span> in the <span className="text-foreground font-bold">{selectedCountry}</span> quiz.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-secondary/50 rounded-2xl">
                  <div className="text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Accuracy</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-2xl">
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Points</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-4 bg-secondary text-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
                >
                  <RefreshCcw size={20} />
                  Try Again
                </button>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                  New Country
                  <Globe size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
