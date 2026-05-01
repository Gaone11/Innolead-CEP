# Innolead CEP — Client Enablement Platform

An AI-powered consulting journey platform built by **Innolead Consulting** that guides organisations from diagnostic to delivered results, with intelligent agents working alongside consultants at every step.

**Live Site:** [gaone11.github.io/Innolead-CEP](https://gaone11.github.io/Innolead-CEP/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [AI Agents](#ai-agents)
- [Platform Views](#platform-views)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Theme System](#theme-system)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)
- [User Roles](#user-roles)

---

## Overview

The Innolead Client Enablement Platform (CEP) is a full-stack web application that digitises the consulting engagement lifecycle. It combines AI-driven diagnostics, toolkit delivery, session booking, CRM lead management, and consultant briefing into one unified platform.

The platform is built around **Uhuru AI** — Innolead's proprietary intelligence layer — which powers five autonomous agents that operate continuously across all modules.

---

## Key Features

| Feature | Description |
|---|---|
| Organisational Diagnostic | 4-section maturity assessment scoring clients across Strategy, Governance, Execution, and People |
| AI Recommendations | Automatically generated action plans based on diagnostic results |
| Toolkit Library | Browsable library of 48+ proprietary consulting frameworks with AI-matched recommendations |
| Smart Booking | Session scheduling with consultant matching and availability management |
| AI Guidance Agent | Real-time chat-based consulting assistant with streamed responses |
| Results Dashboard | Score ring visualisation, dimension breakdown, and trend tracking |
| Admin & CRM | Lead pipeline management, scoring, urgency flags, and conversion analytics |
| Consultant Portal | AI-generated pre-session briefing notes with client context and focus areas |
| Light / Dark Theme | Full theme switching with Innolead brand blue (#1B75BB) as default light accent |
| Notifications | Real-time notification panel with read/unread state and action routing |
| Global Search | ⌘K command palette for instant navigation across all views and toolkits |

---

## AI Agents

The platform runs five AI agents powered by **Uhuru AI (Baobab 3.0)**:

### 1. Client Guidance Agent
Provides real-time consulting advice through a chat interface. Understands the client's diagnostic results and toolkit context to deliver personalised, actionable guidance.

### 2. Diagnostic & Scoring Agent
Processes assessment responses and computes maturity scores across four organisational dimensions. Generates the overall maturity rating and routes clients to appropriate services.

### 3. Sales & CRM Agent
Monitors the lead pipeline, assigns urgency scores, flags hot leads, and recommends follow-up actions for the sales team.

### 4. Consultant Briefing Agent
Automatically generates pre-session briefing notes for consultants before each client engagement, summarising diagnostic results, key gaps, and recommended focus areas.

### 5. Content Evolution Agent
Keeps the toolkit library current by flagging outdated content and suggesting updates based on client usage patterns and diagnostic trends.

---

## Platform Views

### Landing Screen
Entry point with split layout — brand messaging on the left, sign-in form on the right. Displays demo credentials for prototype access.

### Dashboard
Personalised client dashboard showing journey progress, active agents status, recent activity, quick actions, and upcoming session countdown.

### Diagnostic Assessment
Four-section maturity questionnaire (Strategic Clarity, Governance & Compliance, Execution Capability, People & Culture). Section-by-section navigation with progress tracking. Results submitted to the Diagnostic & Scoring Agent.

### My Results
Score ring visualisation showing overall maturity percentage, dimension breakdown bars with trend indicators vs previous assessment, and AI-generated recommendations with priority levels, linked toolkits, and suggested services.

### Toolkit Explorer
Card-based library of consulting frameworks. Filterable by category. Each toolkit shows rating, download count, AI PICK badge, and a preview modal with included assets.

### AI Guidance Agent
Full chat interface with the Client Guidance Agent. Supports streamed responses, quick-action prompt chips, and conversation context retention.

### Book a Session
Step-by-step booking flow: select service → choose consultant → pick date/time → confirm. Shows consultant profiles, specialisations, and ratings.

### Admin & CRM
Lead management dashboard for the Innolead sales team. Displays pipeline stages, lead scoring, urgency flags, contact details, and conversion analytics.

### Consultant Portal
Pre-session briefing view for Innolead consultants. Shows upcoming sessions, AI-generated client briefings with critical gaps, toolkit context, and focus area recommendations.

### Settings
Tabbed settings modal covering General preferences, Notifications, AI & Agents configuration, Security, and Appearance (Light/Dark theme toggle).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| UI Components | Custom (no component library) |
| Icons | Lucide React |
| Fonts | Montserrat (headings) + Roboto (body) via Google Fonts |
| State Management | React useState / useEffect |
| Deployment | GitHub Pages via GitHub Actions |
| Build Output | Static Export (`output: "export"`) |

---

## Project Structure

```
innolead-cep/
├── app/
│   ├── globals.css              # CSS variables, theme system, animations
│   ├── layout.tsx               # Root HTML layout with font imports
│   ├── page.tsx                 # Entry point — renders CEPApp
│   └── components/
│       ├── CEPApp.tsx           # Root component: state, routing, theme
│       ├── Sidebar.tsx          # Navigation sidebar with collapse
│       ├── Header.tsx           # Top bar with search, notifications, user menu
│       ├── LandingScreen.tsx    # Login / entry screen
│       ├── SettingsModal.tsx    # Settings panel with theme toggle
│       ├── NotificationPanel.tsx# Notification dropdown
│       ├── SearchOverlay.tsx    # ⌘K global search
│       ├── UserMenu.tsx         # User profile dropdown + role switcher
│       └── views/
│           ├── DashboardView.tsx
│           ├── DiagnosticView.tsx
│           ├── ResultsView.tsx
│           ├── ToolkitsView.tsx
│           ├── AgentView.tsx
│           ├── BookingView.tsx
│           ├── AdminView.tsx
│           └── ConsultantView.tsx
├── public/
│   └── innolead-logo.png        # Innolead brand logo (transparent background)
├── next.config.ts               # Static export + GitHub Pages basePath config
├── tailwind.config.ts           # Tailwind theme extensions
└── .github/
    └── workflows/
        └── nextjs.yml           # GitHub Actions CI/CD deployment workflow
```

---

## Theme System

The platform uses **CSS Custom Properties** for full light/dark theming without any JavaScript re-renders.

### Light Theme (Default)
```css
--bg-base:       #F8FAFD   /* Page background */
--bg-card:       #FFFFFF   /* Card backgrounds */
--bg-elevated:   #F1F5F9   /* Inputs, elevated surfaces */
--border:        #E2E8F0   /* Borders and dividers */
--text-heading:  #0F172A   /* Headings */
--text-primary:  #1E293B   /* Body text */
--text-secondary:#64748B   /* Secondary text */
--accent:        #1B75BB   /* Innolead brand blue */
```

### Dark Theme
```css
--bg-base:       #0F1419   /* Deep navy background */
--bg-card:       #1A1F2E   /* Card backgrounds */
--bg-elevated:   #252B3A   /* Elevated surfaces */
--border:        #374151   /* Borders */
--text-heading:  #FFFFFF   /* Headings */
--text-primary:  #E5E7EB   /* Body text */
--accent:        #3BC2FB   /* Cyan accent */
```

Theme is applied by setting `data-theme="dark"` on the `<html>` element via `document.documentElement.setAttribute("data-theme", theme)`. The toggle lives in **Settings → Appearance**.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and Run

```bash
# Clone the repository
git clone https://github.com/Gaone11/Innolead-CEP.git
cd Innolead-CEP/innolead-cep

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open global search |
| `Escape` | Close any open overlay |

---

## Deployment

The platform is deployed to **GitHub Pages** using GitHub Actions. Every push to `main` triggers an automatic build and deploy.

### How It Works

1. GitHub Actions checks out the repo
2. Installs dependencies from `innolead-cep/package-lock.json`
3. Runs `next build` with `output: "export"` to generate static files
4. Uploads the `innolead-cep/out/` directory as a GitHub Pages artifact
5. Deploys to `gaone11.github.io/Innolead-CEP/`

### Key Config (next.config.ts)

```ts
const nextConfig = {
  output: "export",          // Static HTML export
  trailingSlash: true,       // Required for GitHub Pages routing
  images: { unoptimized: true }, // No server-side image optimisation
  basePath: "/Innolead-CEP", // GitHub Pages subdirectory path
  assetPrefix: "/Innolead-CEP/", // Prefix for all _next/ assets
};
```

> **Note:** `basePath` and `assetPrefix` must match your GitHub repository name exactly, including capitalisation.

---

## Demo Credentials

The platform is a prototype with demo login. Use any of the following to sign in:

| Field | Value |
|---|---|
| Email | james.doe@acme.co.bw |
| Password | any value |

---

## User Roles

The platform supports three role personas, switchable from the user menu (demo mode):

| Role | Access |
|---|---|
| **Client** | Dashboard, Diagnostic, Results, Toolkits, AI Agent, Booking |
| **Consultant** | Consultant Portal with AI briefing notes and session management |
| **Administrator** | Admin & CRM dashboard with lead pipeline and analytics |

---

*Built by OrionX · Powered by Uhuru AI · © 2026 Innolead Consulting*
