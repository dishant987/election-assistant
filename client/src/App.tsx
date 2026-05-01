import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChatPage } from "./pages/ChatPage";
import { QuizPage } from "./pages/QuizPage";
import { TimelinePage } from "./pages/TimelinePage";
import { ProcessPage } from "./pages/ProcessPage";
import { NewsPage } from "./pages/NewsPage";
import { FAQPage } from "./pages/FAQPage";
import { SimulatorPage } from "./pages/SimulatorPage";
import { MythBusterPage } from "./pages/MythBusterPage";

import { ThemeProvider } from "next-themes";

import { useEffect } from "react";
import { useChatStore } from "./store/chatStore";
import { COUNTRIES } from "./types";

function App() {
  const { selectedCountry, setCountry } = useChatStore();

  // Validate persisted state
  useEffect(() => {
    if (selectedCountry && !COUNTRIES.find(c => c.id === selectedCountry)) {
      setCountry("india");
    }
  }, [selectedCountry, setCountry]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/news" element={<NewsPage />} />
        <Route path="/faq" element={<FAQPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/myth-buster" element={<MythBusterPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
