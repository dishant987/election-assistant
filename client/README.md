# 🎨 VoteWise Frontend

This is the React-based frontend for the VoteWise Election Assistant.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (using the new `@tailwindcss/vite` plugin)
- **State**: Zustand (Store located in `src/store/useChatStore.ts`)
- **Querying**: TanStack Query (React Query)
- **UI Components**: Radix UI + Lucide Icons + Shadcn-inspired custom components
- **Animations**: Framer Motion

## 🚀 Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Ensure the backend is running at `http://localhost:3000`.

## 📁 Core Directory Structure

- `src/components`: UI elements like `ChatMessage`, `ChatInput`, and `Layout`.
- `src/pages`: Main application screens (`Home.tsx` and `ChatPage.tsx`).
- `src/store`: Global state management using Zustand.
- `src/hooks`: Custom hooks for things like `useStreamingChat`.
- `src/types`: TypeScript interfaces for messages and responses.

## 🌍 Multilingual Support

The app supports English, Hindi, and Gujarati. The language is managed in `useChatStore` and passed to the backend for AI context and used locally for TTS (Read Aloud) voice selection.

## 🎙️ Read Aloud Implementation

Located in `src/components/ChatMessage.tsx`, it uses the browser's `SpeechSynthesis` API. It matches the voice to the message's language and provides playback controls.

