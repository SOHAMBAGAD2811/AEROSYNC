# AeroSync Next.js — Fleet Prognostics & MRO Scheduling Platform

A high-performance, full-stack Next.js 14 (App Router) port of the AeroSync (FLARE) Indian Air Force Predictive Fleet Maintenance and Operations Command platform.

This standalone repository contains the entire frontend UI, 3D interactive digital twins with Three.js/GLTF models, NASA C-MAPSS prognostic ladders, and zero-dependency in-memory mock backend API route handlers (`/api/v1/*`), pre-configured for **one-click deployment on Vercel**.

---

## 🚀 Key Features

- **Next.js 14 App Router & TypeScript**: Production-ready server and client components, strict type definitions, optimized static and dynamic routing.
- **Self-Contained Fullstack Route Handlers**: All 24+ REST endpoints implemented in `src/app/api/v1/*`, supporting live CRUD operations, fleet KPIs, telemetry streams, alarms, procurement, and append-only audit trail with zero external backend or database dependencies.
- **Interactive 3D Digital Twin**: Built with Three.js and `@react-three/fiber` / `@react-three/drei` (with fallback Three.js canvas), showcasing interactive Dassault Rafale, Landing Gear, and Radar GLB models with sensor hot-spots, thermal maps, and borescope view.
- **SSR-Safe ECharts**: Dynamic SSR-isolated ECharts wrapper for telemetry trend charts, degradation profiles, and Monte Carlo simulation histograms.
- **Role-Based Operational Access (RBAC)**: Switch seamlessly between Commander, Maintenance Officer (MEO), Logistics Officer, and Flight-Line Technician personas with customized views and action permissions.
- **AI-Powered Flight-Line MRO Copilot**: Interactive assistant drawer for immediate contextual diagnostics, checklist generation, and maintenance procedure guidance.
- **Military Aviation Aesthetics**: Custom IAF-grade styling, high-contrast dark and light modes, typography matching Indian Air Force technical flight-line logs.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, PostCSS
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Charts & Data Viz**: ECharts, `echarts-for-react`
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query & Axios
- **Icons**: Lucide React

---

## 📦 Project Structure

```
aerosync-nextjs/
├── public/
│   ├── images/              # IAF aircraft photography & hero banners
│   └── models/              # 3D GLTF models (rafale.glb, landing-gear.glb, radar.glb)
├── src/
│   ├── app/
│   │   ├── (portal)/        # Protected operational portal pages
│   │   │   ├── dashboard/   # Executive fleet readiness & operational KPIs
│   │   │   ├── alarms/      # Critical flight-line snags & alarms
│   │   │   ├── aircraft/    # 100-airframe roster & tail detail diagnostics
│   │   │   ├── schedule/    # CP-SAT automated hangar slot scheduling board
│   │   │   ├── twin/        # Interactive 3D Digital Twin view
│   │   │   ├── spares/      # Inventory & procurement management
│   │   │   ├── work-orders/ # Maintenance technical directives command
│   │   │   ├── simulation/  # Monte Carlo fleet resilience & what-if simulator
│   │   │   ├── ingestion/   # C-MAPSS dataset stream ingestion & Pandera quality
│   │   │   ├── evaluation/  # NASA C-MAPSS FD001–FD004 model ladder benchmark
│   │   │   └── admin/       # MLflow registry & append-only audit ledger
│   │   ├── api/v1/          # Zero-dependency API route handlers
│   │   ├── landing/         # Public interactive landing showcase
│   │   ├── login/           # Authentication portal with demo accounts
│   │   ├── layout.tsx       # Root Next.js layout & fonts
│   │   └── globals.css      # Custom styling, fonts, and table themes
│   ├── components/
│   │   ├── charts/          # EChartsClient SSR dynamic wrapper
│   │   ├── layout/          # AppShell, Navigation, TopBar
│   │   ├── providers/       # TanStack Query Client Provider
│   │   └── ui/              # MRO Copilot, badges, modals
│   ├── lib/
│   │   ├── api-client.ts    # Axios client with bearer token injection
│   │   └── mock-data.ts     # In-memory database with 100 IAF airframes
│   ├── store/               # SSR-safe Zustand stores (auth, websocket)
│   └── types/               # TypeScript interfaces matching backend models
├── vercel.json              # Vercel deployment configuration
└── package.json
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18.17+ or Node.js 20+
- npm or yarn or pnpm

### Getting Started

1. Clone or navigate into the directory:
   ```bash
   cd aerosync-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ☁️ Deploying to Vercel

This repository is optimized for zero-configuration, 1-click deployment on [Vercel](https://vercel.com):

### Option 1: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd aerosync-nextjs
   vercel
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Via Git & Vercel Dashboard

1. Push this folder to a GitHub, GitLab, or Bitbucket repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial AeroSync Next.js project"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will be automatically detected as **Next.js**.
5. Click **"Deploy"**. No environment variables or external database configuration are required!

---

## 🔐 Demo Credentials

When opening the portal or `/login`, you can use any of the pre-configured IAF personas:

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Air Commodore** | `commander` | `admin123` | Full strategic command, schedule override, readiness simulator |
| **Maintenance Officer** | `meo` | `admin123` | Engineering sign-offs, slot approvals, technical directives |
| **Logistics Officer** | `logistics` | `admin123` | Spares replenishment, PO approval, supplier lead times |
| **Technician** | `technician` | `admin123` | Sensor trends, snag logging, borescope checklists |
| **System Admin** | `admin` | `admin123` | Ingestion, C-MAPSS benchmark ladder, MLflow & audit log |

*(Alternatively, the app automatically initializes in demo mode so you can test all views immediately without manual login).*

---

## 🛡️ License

Confidential & Proprietary — Indian Air Force Operations & Maintenance Research Platform.
