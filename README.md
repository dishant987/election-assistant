# 🗳️ VoteWise: AI-Powered Election Education Assistant

VoteWise is a modern, intelligent chat platform designed to educate citizens about election processes, voting rights, and democratic systems across various countries. Built with a premium glassmorphic UI and powered by Google's Gemini AI, it provides accurate, non-partisan information in multiple languages.

![VoteWise Banner](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Features

- **🌍 Multi-Country Context**: Specialized knowledge for elections in India, USA, UK, France, and Germany.
- **🗣️ Multilingual Support**: Chat seamlessly in **English**, **Hindi**, and **Gujarati**.
- **🎙️ Read Aloud (TTS)**: Integrated text-to-speech for accessibility, allowing users to listen to AI responses.
- **⚡ Real-time Streaming**: Instant response generation using chunked transfer encoding for a smooth chat experience.
- **🎨 Premium UI/UX**: Professional glassmorphic design with dark/light mode support, smooth animations (Framer Motion), and responsive layout.
- **📄 Markdown Support**: Responses are rendered with full markdown support, including tables, lists, and bold text.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Validation**: [Zod](https://zod.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Election
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

You need to run both the server and the client simultaneously.

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:3000`.

2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`.

## 📁 Project Structure

```text
Election/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components (Home, Chat)
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript definitions
├── server/                # Express Backend
│   ├── src/
│   │   ├── lib/           # Helper libraries (Gemini config, prompts)
│   │   ├── middleware/    # Express middlewares
│   │   └── routes/        # API route definitions
└── README.md              # Main documentation
```
