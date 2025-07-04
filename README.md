
# AI‑CARpage‑Project 🚗

A modern, full-stack AI-powered car listing web application built with Next.js, TypeScript, and Tailwind CSS. Includes server-side APIs, reusable UI components, end‑to‑end tests, and analytics instrumentation.

## 🚀 Tech Stack

- **Frontend**: Next.js + React (TypeScript), Tailwind CSS for styling  
- **Backend/Server**: Next.js API Routes (`pages/api/…`)  
- **State & Data**: React hooks (`hooks/`), utilities & API clients (`lib/`)  
- **Infrastructure**: Drizzle ORM (`drizzle.config.ts`), instrumentation (`instrumentation.ts`)  
- **Testing**: Playwright for end‑to‑end and UI testing (`tests/`)  
- **Config & Tooling**: ESLint, Tailwind, PostCSS, Biome, etc.  
- **CI/CD**: GitHub Actions workflows (`.github/workflows/`)  

## 📦 Prerequisites

- Node.js (v18+)  
- PNPM or Yarn/npm  
- A database (e.g., PostgreSQL) configured in `.env`

## 🛠️ Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/RashiAJ/AI-CARpage-Project.git
   cd AI-CARpage-Project

2. Install dependencies

pnpm install
Configure environment
Copy .env.example → .env.local and set your variables (database URL, API keys, etc.).

3. Set up the database
Adjust drizzle.config.ts and run migrations or sync as needed:

pnpm drizzle-kit generate
db.generate
db.migrate
pnpm drizzle-kit up


4. Run the dev server

pnpm dev
Then visit http://localhost:3000.
