import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChatPage } from "./pages/ChatPage";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
