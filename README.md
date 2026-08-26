# 🎬 Kron Script AI — Creative Production Workspace
> **A Cinematic Dark-Lux AI Production Suite for Modern Creators, Filmmakers, and Digital Brands.**

[![Live Workspace](https://img.shields.io/badge/Live-kronscriptai.online-8B5CF6?style=flat-for-the-badge)](https://kronscriptai.online)
[![Vite](https://img.shields.io/badge/Vite-5.0+-FFD600?style=flat-for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2+-20232A?style=flat-for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0+-FFCA28?style=flat-for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Google_SDK-0F9D58?style=flat-for-the-badge&logo=googlegemini)](https://ai.google.dev/)

---

## 🌌 Visual Identity & Creative Philosophy
**Kron Script AI** is designed with a premium, eye-safe **Cinematic Dark Luxury** theme. Melding high-contrast **lavender accents**, **neon-purple status rings**, and **translucent glassmorphic panels (`backdrop-blur`)**, the user interface provides a focused theater-like workspace. Every typographic, spatial, and motion transition is designed to inspire high-fidelity visual storytelling.

---

## 🚀 Creator Workflow: From Spark to Broadcast
Kron Script AI acts as a cohesive full-pipeline studio that manages the lifecycle of your media assets:

```
  [ IDEATION ] ──> [ SCRIPTWRITING ] ──> [ PROMPT STUDIO ] ──> [ PRODUCTION SAFE-ZONES ] ──> [ QUALITY ASSURANCE ]
  Brainstorm with     Multi-scene        Generate realistic      Analyze audio, pacing,      Multimodal Vision checks,
  Expert Chat        Celtx-styled text     seed prompt cards        and framing guidelines       CTR forecasts & captions
```

1. **The Spark (Ideation)**: Converse with the built-in **AI Creative Consultant** to brainstorm titles, narrative angles, and hook structures.
2. **The Script (Celtx Screenplay Editor)**: Format raw ideas into standard screenplay format with Scene Headings, Action lines, Parentheticals, and Characters.
3. **The Visuals (Prompt Studio)**: Leverage our custom **Daily Realistic Prompt Series** to construct high-fidelity prompt cards for hyper-realistic renders.
4. **The Setup (Production Safe-Zones)**: View overlays for aspect ratios (9:16, 16:9, 1:1) to keep subject matter centered and text inside social media UI safe-zones.

---

## 🛠️ Deep Feature Breakdown

### 1. Celtx-Style Screenplay Builder
- **Dynamic Scene Formatting**: Instantly format character names, action lines, dialog, and parentheticals.
- **Multimodal Expander**: Instantly expand brief scene summaries into fully-dialogued acts via the Gemini API.

### 2. Prompt Studio (Daily Realistic Series)
- High-fidelity **10-Product seed configurations** covering luxury leather handbags, flagship smartphones, track-focused electric hypercars, and minimalist furniture.
- Includes positive seed formulas, expert configurations, color-and-material palettes, and direct-download sample assets.

### 3. Multimodal Thumbnail & Framing Analyzer
- **Heatmap Diagnostics**: Simulates human eye-gaze tracking to pinpoint composition focus.
- **Vibe & Contrast Rating**: Scans saturation and luminance distributions to score visual clickability.
- **Social Overlays**: Live safe-zone boundaries for YouTube, TikTok, and Instagram overlay placement.

### 4. Smart Video Pacing & Captions Generator
- Analyzes script lengths against target screen durations to forecast dynamic pacing and detect narration bottleneck regions.
- Auto-generates readable, stylized subtitles and speech cues.

### 5. Secure Workspace Collaboration & History
- Synchronizes drafted screenplays, active prompt cards, and completed vision logs dynamically into Firebase Firestore.
- Access projects seamlessly across devices with real-time updates.

---

## 📐 Architecture & Technology Stack

```
               [ CLIENT-SIDE FRONTEND ]
     React 18 (Vite) + Tailwind CSS + Motion Animations
                       │
       Identity Authentication & Snapshot Streams
                       ▼
            [ FIREBASE CLOUD SERVICES ]
          Firestore Database & Security Rules
                       ▲
                       │ Authenticated ID Tokens & API Requests
                       ▼
           [ SECURE EXPRESS BACKEND ]
         Cloud Run + Firebase Admin SDK + Google GenAI
                       ▲
                       │ Text & Vision Processing
                       ▼
               [ GEMINI AI MODELS ]
```

- **Frontend**: Single-Page Application (SPA) powered by **React 18** and **Vite** with fluent, hardware-accelerated transitions via **Motion** (`motion/react`).
- **Styles**: Styled entirely with customized **Tailwind CSS v4** featuring fluid layouts, responsive grid patterns, and fine-tuned dark themes.
- **Backend Services**: **Express** server acting as a secure API Gateway, checking Firebase ID tokens to guard access keys.
- **Databases & Auth**: **Firebase Auth** handles client registration/sessions. **Firebase Firestore** handles workspace persistence, metrics, and logs.
- **AI Core**: Google’s `@google/genai` TypeScript SDK driving real-time structured content, text parsing, and multimodal vision diagnostics.

---

## 🔒 Zero-Trust Security & Production-Readiness
This platform enforces a strict, **Zero-Trust Token-Based Entitlement Architecture**:

* **Server-Authoritative Transactions**: To prevent tampering, all coin consumption and balance edits are blocked from the client. User balances can only be debited or credited by verified backend endpoints:
  - `/api/consume-credits`: Verifies the caller's Firebase ID token, deducts specified credits within a safe database transaction, and registers a unique transaction ID.
  - `/api/refund-credits`: Initiates server-side rollbacks if an AI process encounters a downstream failure.
  - `/api/grant-reward`: Secures the distribution of referral, verification, and module-graduation rewards against fake click-claims.
* **Locked Firestore Security Rules**: Fully secure `firestore.rules` preventing users from modifying billing fields, credit balances, premium tier status, or referral states directly from client-side SDKs.
* **No Expose Keys Policy**: The Gemini API keys and Firebase Admin credentials remain fully isolated inside server-side environment variables.

---

## 📂 Repository Structure
```
├── .env.example              # Template for server-side secret variables
├── firestore.rules           # Secure, hardened Firebase Security Rules
├── package.json              # App dependencies and bundle scripts
├── server.ts                 # Full-stack Express API server & Vite Middleware
├── src/
│   ├── App.tsx               # Client routes & Navigation entrypoint
│   ├── main.tsx              # React mounting root
│   ├── index.css             # Tailwind setup & Google Font family imports
│   ├── components/           # Sub-components
│   │   ├── CreatorToolkit.tsx # Multi-tab AI tool execution suite
│   │   ├── SupportChat.tsx    # Interactive AI Creative Consultant
│   │   └── ...
│   ├── pages/                # Workspace page modules
│   │   ├── DashboardCourse.tsx  # Interactive educational challenge board
│   │   ├── DashboardLayout.tsx  # Dashboard shell layout & balance sync
│   │   └── MoreBlogs.tsx        # Branded Editorial publications hub
│   └── lib/                  # Library bootstrap files
│       └── firebase.ts       # Client-side Firebase configuration
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- **Node.js** (v18.0 or later recommended)
- **NPM** or **Bun** package manager
- **Firebase Project** with Firestore and Authentication enabled

### 2. Configure Environment Variables
Copy `.env.example` to create a local configuration file:
```bash
cp .env.example .env
```
Populate `.env` with your secure keys (never commit this file to Git):
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
```

### 3. Installation & Booting
Install all application dependencies:
```bash
npm install
```

Start the application in local development mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Express server will boot, proxying asset requests through the Vite middleware seamlessly.

### 4. Compiling & Production Build
To create a production-ready bundle and compile the TypeScript server into self-contained CommonJS:
```bash
npm run build
```
Run the compiled build:
```bash
npm run start
```

---

## 🤝 Contribution Guidelines
We welcome contributions to make Kron Script AI the premier hub for visual creators!
1. **Fork** the repository.
2. Create a specific feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes with highly descriptive commit messages.
4. Push your branch to GitHub and open a **Pull Request**.

---

## 🌐 Connections
- **Live Platform**: [https://kronscriptai.online](https://kronscriptai.online)
- **Official GitHub Codebase**: [https://github.com/starbruce91/kron-script-ai](https://github.com/starbruce91/kron-script-ai)

---
*Created with 💜 by digital creators, for digital creators.*
