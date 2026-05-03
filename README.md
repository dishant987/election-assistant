# 🗳️ VoteWise: AI-Powered Election Education Assistant

VoteWise is a premium, intelligent platform designed to educate citizens about election processes, voting rights, and democratic systems. Built with a sophisticated **Enterprise-grade glassmorphic UI** and powered by **Google's Gemini AI**, it provides accurate, non-partisan information to empower voters worldwide.

![VoteWise Banner](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Key Features

- **👔 Enterprise UI/UX**: Professional, high-end design aesthetic with subtle animations (Framer Motion), glassmorphism, and seamless dark/light mode transitions.
- **📰 Live Election News**: Real-time news feed summarized by AI, keeping users updated with the latest political developments globally, with India as the default region.
- **🌍 Multi-Country Intelligence**: Deep contextual knowledge of electoral systems in India, USA, UK, France, and Germany.
- **🙋 FAQ Hub**: A centralized, accessible knowledge base covering everything from voter registration to polling booth protocols.
- **🎮 Voting Simulator**: An interactive walkthrough that guides users through the step-by-step process of casting a vote.
- **🗣️ Multilingual Accessibility**: Seamlessly switch between **English**, **Hindi**, and **Gujarati** for inclusive education.
- **🎙️ Read Aloud (TTS)**: Integrated high-quality text-to-speech for AI responses, enhancing accessibility for all users.
- **🎓 Quiz & Myth Buster**: Gamified learning modules and a dedicated section to debunk common election misinformation and rumors.
- **⏳ Election Timeline**: Visualized schedules and milestones to help voters stay ahead of important dates.

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
- **AI Engine**: [Google Gemini 3 Flash](https://ai.google.dev/)
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

## ☁️ Deployment

The application is containerized and optimized for **Google Cloud Run**.

- **CI/CD**: Deployment scripts are provided for seamless GCP updates.
- **Containerization**: Includes optimized Dockerfiles for both Client and Server.
- **Environment**: Managed using Cloud Secret Manager for sensitive keys.

## 📁 Project Structure

```text
Election/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Feature-specific pages (News, Simulator, FAQ, Quiz)
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript definitions
├── server/                # Express Backend
│   ├── src/
│   │   ├── lib/           # Helper libraries (Gemini config, prompts, secrets)
│   │   ├── middleware/    # Express middlewares (Rate limiting, logging)
│   │   └── routes/        # API route definitions (Chat, News)
└── README.md              # Main documentation
```

## 🛡️ Quality & Compliance

VoteWise is built with high standards for reliability and inclusivity:

- **♿ Accessibility (A11y)**: 100% compliant with ARIA standards, including semantic HTML, screen-reader optimized labels (`aria-label`), keyboard navigation, and `aria-live` regions for real-time AI updates.
- **🛡️ Security**: Implements standard security headers (CSP, HSTS, X-Frame-Options), robust rate-limiting via `express-rate-limit`, and strict Zod-based request validation.
- **🧪 Testing Suite**: Includes comprehensive integration tests for APIs using `supertest` and unit tests for state management and utilities using `vitest`.
