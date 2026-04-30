import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChatPage } from "./pages/ChatPage";
import { QuizPage } from "./pages/QuizPage";
import { TimelinePage } from "./pages/TimelinePage";

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

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
