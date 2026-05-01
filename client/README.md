# 🎨 VoteWise Frontend

This is the premium React-based frontend for the VoteWise Election Assistant, featuring an Enterprise-grade glassmorphic design and intelligent features.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (using the new `@tailwindcss/vite` plugin)
- **State**: Zustand (Store located in `src/store/useChatStore.ts`)
- **Querying**: TanStack Query (React Query)
- **UI Components**: Radix UI + Lucide Icons + Shadcn UI
- **Animations**: Framer Motion for smooth transitions and micro-interactions

## 🚀 Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Ensure the backend is running (defaults to `http://localhost:3000`).

## 📁 Core Directory Structure

- `src/components`: UI elements like `ChatMessage`, `ChatInput`, `Navbar`, and `Footer`.
- `src/pages`: Feature-specific screens:
  - `LandingPage.tsx`: The high-impact enterprise entrance.
  - `ChatPage.tsx`: AI-powered conversational interface.
  - `NewsPage.tsx`: Real-time AI-summarized election news.
  - `SimulatorPage.tsx`: Interactive voting process walkthrough.
  - `FAQPage.tsx`: Categorized educational resource hub.
  - `QuizPage.tsx`: Gamified knowledge testing.
  - `MythBusterPage.tsx`: Debunking misinformation.
  - `TimelinePage.tsx`: Visualized election schedules.
- `src/store`: Global state management (Zustand).
- `src/hooks`: Custom hooks like `useStreamingChat`.
- `src/types`: TypeScript interfaces for core data structures.

## 🌍 Multilingual Support

The app supports **English**, **Hindi**, and **Gujarati**. The language is managed in `useChatStore`, influencing the AI's response context and the browser's `SpeechSynthesis` (TTS) voice selection.

## 🎙️ Read Aloud Implementation

Integrated in the `ChatMessage` component, the system uses the native `SpeechSynthesis` API to provide high-quality audio feedback of AI responses, matching the voice profile to the selected language.

## 👔 Enterprise Design Philosophy

The frontend adheres to a professional aesthetic:
- **Glassmorphism**: Subtle translucency for a modern feel.
- **Micro-animations**: Enhanced feedback for user interactions.
- **Accessibility**: High contrast and responsive layouts across all devices.
- **Harmonious Palette**: Using professional indigo and slate tones for trust and reliability.


