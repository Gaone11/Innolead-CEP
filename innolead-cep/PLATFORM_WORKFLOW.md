# Innolead CEP — Platform Workflow Documentation

## Overview

**Innolead CEP (Client Enablement Platform)** is an AI-powered consulting platform that guides clients through organisational maturity diagnostics, provides tailored recommendations from uploaded knowledge base documents, and connects them with expert consultants.

- **Stack:** Next.js 16 (static export) + React 19 + Tailwind CSS v4
- **Deployment:** GitHub Pages at `/Innolead-CEP/`
- **Backend:** None — all data persists in-browser (localStorage + IndexedDB)

---

## 1. Authentication & User Roles

### Login Flow

```
User visits site → Landing Screen → Enters email → Signs in
```

- Email-based login (no password validation in current build)
- Session persists in `localStorage` — page refresh keeps user signed in
- Sign out clears active session but retains saved user data

### User Roles

| Role | Access | How Assigned |
|------|--------|--------------|
| **Client** (default) | Dashboard, Diagnostic, Results, AI Agent, Toolkits, Booking | Any email |
| **Admin** | All client views + Admin/CRM, Consultant Portal, Knowledge Base | `gaone@uhuruai.co`, `monti@uhuruai.co` |

### Known User Profiles

| Email | Name | Org |
|-------|------|-----|
| `gaone@uhuruai.co` | Gaone Molefi (GM) | Uhuru AI |
| `monti@uhuruai.co` | Monti (MO) | Uhuru AI |
| Any other email | James Doe (JD) | Acme Corp |

---

## 2. Platform Views

### Navigation Map

```
Sidebar
├── MAIN
│   ├── Dashboard
│   ├── Toolkits
│   ├── Diagnostic
│   ├── AI Agent
│   ├── Book Session
│   └── My Results
├── ADMIN (admin only)
│   ├── Admin / CRM (placeholder)
│   └── Consultant Portal (placeholder)
└── AI TRAINING (admin only)
    └── Knowledge Base
```

### View Descriptions

| View | Purpose |
|------|---------|
| **Dashboard** | Welcome screen with 4 quick-action cards (Run Diagnostic, Browse Toolkits, Talk to AI Agent, Book a Session) |
| **Diagnostic** | 4-section maturity assessment with 12 base questions + dynamic KB questions |
| **My Results** | Score ring, dimension breakdown, KB-powered insights, export to file |
| **AI Agent** | Chat interface — searches KB documents, cross-references diagnostic scores |
| **Toolkits** | Library of 6 consulting frameworks with search, filter, preview, download |
| **Book Session** | AI-matched consultant selection with date/time booking |
| **Knowledge Base** | Admin-only: upload, manage, and delete documents that train the AI |

---

## 3. Core Workflow: Diagnostic → Results → Recommendations

This is the primary user journey through the platform.

### Step 1: Diagnostic Assessment

```
Dashboard → "Run Diagnostic" → DiagnosticView
```

**4 assessment sections, 3 base questions each:**

| Section | Topics |
|---------|--------|
| Strategic Clarity | Strategy documentation, KPI tracking, execution plans |
| Governance & Compliance | Board governance, risk assessments, compliance tracking |
| Execution Capability | Project delivery, PM standards, change management |
| People & Culture | Talent development, engagement, leadership values |

**KB-enhanced questions:**
- If Knowledge Base has documents, up to 2 additional questions per section are added
- These are selected from a predefined question pool based on keywords found in uploaded documents
- Marked with a **KB** badge to distinguish from base questions

**Scoring:**
- Each question has 5 options (Strongly Disagree → Strongly Agree, scored 0–4)
- Section score = `(sum of answers / (count × 4)) × 100`
- Overall score = average of all section scores

**Maturity levels:**
- **High Maturity** (70%+) — green
- **Medium Maturity** (45–69%) — orange
- **Low Maturity** (below 45%) — red

### Step 2: Results & Insights

```
Diagnostic completion → "View Full Report" → ResultsView
```

**Displays:**
- Overall score ring (animated SVG)
- Per-dimension progress bars with scores
- KB Insights section (if documents uploaded):
  - Searches uploaded documents per dimension
  - Shows tailored guidance based on score level:
    - Low score: "Consider focusing on — {document insight}"
    - Mid score: "To strengthen this area — {document insight}"
    - High score: "Continue leveraging — {document insight}"
- Export button: downloads a `.txt` report with all scores

### Step 3: AI Agent Recommendations

```
Results → "Ask AI Agent for Recommendations" → AgentView
```

**The AI Agent's behaviour depends on context:**

| Context | Agent Behaviour |
|---------|-----------------|
| Has scores + KB docs + user asks for recommendations | Cross-references weakest dimensions with KB documents, gives tailored advice per dimension |
| Has scores + user asks about a specific dimension | Returns KB insights for that dimension with score context |
| KB docs exist + general question | Searches all documents, returns top 3 matching snippets |
| No KB docs, has scores | Acknowledges scores, suggests uploading documents |
| No KB docs, no scores | Prompts user to complete diagnostic and upload documents |

**Side panel shows:**
- Diagnostic score breakdown (if completed)
- Knowledge Base document count

### Step 4: Booking a Consultant

```
Results or Agent → "Book a Consultant" → BookingView
```

**Booking flow:**
1. Select consultant (3 available, each with AI match %)
2. Select service type (4 options, BWP 850 – BWP 45,000+)
3. Pick date and time slot
4. Confirm → booking success screen

**Consultants:**

| Name | Specialty | AI Match |
|------|-----------|----------|
| Thabo Mokoena | Strategy & Change Management | 96% |
| Dr. Aisha Dlamini | Governance & Compliance | 91% |
| Kagiso Sithole | Execution & Operations | 84% |

---

## 4. Knowledge Base System (Admin Only)

### Purpose

Documents uploaded here power three platform features:
1. **Dynamic diagnostic questions** — adds KB-informed questions to the assessment
2. **Results insights** — shows document-sourced recommendations per dimension
3. **AI Agent responses** — agent searches documents to answer user questions

### Upload Flow

```
Admin signs in → Sidebar: Knowledge Base → KnowledgeBaseView
→ Drag/drop or click to upload files
→ Text extracted client-side → Keywords generated → Saved to IndexedDB
```

### Supported File Types

| Format | Library Used |
|--------|-------------|
| PDF | pdfjs-dist (page-by-page extraction) |
| DOCX | mammoth (raw text extraction) |
| XLSX/XLS | xlsx (CSV per sheet) |
| PPTX | jszip (XML parsing of slide text) |
| TXT, CSV, MD | Native File.text() API |

### Document Processing Pipeline

```
File Upload
  → Detect file type by extension
  → Extract plain text (format-specific library)
  → Generate keywords (top 50 by frequency, stop-words filtered)
  → Save to IndexedDB as KBDocument { id, name, type, size, uploadedAt, text, keywords }
```

### How Documents Enhance the Platform

**Diagnostic questions:** The system maintains a pool of 8 question templates per dimension. Each template has trigger keywords. When a KB document's keywords match a trigger, that question is added to the diagnostic (max 2 per dimension).

**Results insights:** After completing the diagnostic, the system searches uploaded documents per dimension using keyword matching. Top-scoring snippets are shown as actionable insights.

**Agent search:** When a user asks a question, the agent searches all document text and keywords. Matching documents are ranked by relevance and the best snippets are returned.

### Management Features

- Statistics dashboard: document count, total words, unique keywords, storage
- Search/filter documents by name
- Delete individual documents
- Clear all with confirmation

---

## 5. Data Persistence

### What Persists Across Sessions

| Data | Storage | Scope |
|------|---------|-------|
| Login session (email) | localStorage `icep_session_email` | Global |
| Diagnostic scores | localStorage `icep_user_{email}` | Per user |
| Theme preference | localStorage `icep_user_{email}` | Per user |
| KB documents | IndexedDB `innolead-kb` | Global (shared across users) |

### What Resets Each Session

| Data | Reason |
|------|--------|
| Active view (resets to Dashboard) | React state only |
| Notifications | React state only |
| Booking selections | React state only |
| Agent chat history | React state only |
| Toolkit download states | React state only |

---

## 6. Toolkits Library

6 consulting frameworks available for browse, preview, and download:

| Toolkit | Category | Pages | Rating | Access |
|---------|----------|-------|--------|--------|
| Strategy Execution Toolkit | Strategy | 48 | 4.8 | Free |
| Corporate Governance Framework | Governance | 64 | 4.9 | Free |
| Change Management Playbook | Change | 36 | 4.7 | Free |
| HR & Talent Maturity Assessment | HR | 42 | 4.6 | Free |
| Innovation & Digital Readiness | Innovation | 52 | 4.5 | PRO |
| Financial Governance Toolkit | Finance | 58 | 4.7 | PRO |

**Features:** Category filter, search, preview modal with table of contents, simulated download with progress bar.

---

## 7. Theme System

Two themes available, toggled in Settings:

| Property | Light | Dark |
|----------|-------|------|
| Background | #F8FAFD | #0F1419 |
| Cards | #FFFFFF | #1A1F2E |
| Accent | #1B75BB (blue) | #3BC2FB (cyan) |
| Text | #1E293B | #E2E8F0 |

Theme preference persists per user in localStorage.

---

## 8. Deployment

```bash
npm run build    # Static export to ./out/
# Deploy ./out/ to GitHub Pages
```

- **Repo:** https://github.com/Gaone11/Innolead-CEP
- **Live URL:** https://gaone11.github.io/Innolead-CEP/
- **Config:** `output: "export"`, `basePath: "/Innolead-CEP"`
- No server required — fully static SPA

---

## 9. Complete User Journey Map

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING SCREEN                        │
│                   Email Sign In                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     DASHBOARD                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Run    │ │  Browse  │ │  Talk to │ │  Book a  │   │
│  │Diagnostic│ │ Toolkits │ │ AI Agent │ │ Session  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼─────────────┼────────────┼─────────────┼────────┘
        │             │            │             │
        ▼             ▼            ▼             ▼
  ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │DIAGNOSTIC│  │ TOOLKITS │ │ AI AGENT │ │ BOOKING  │
  │4 sections│  │6 toolkits│ │KB search │ │3 consult.│
  │12+ quest.│  │filter    │ │score-    │ │4 services│
  │KB dynamic│  │preview   │ │aware     │ │date/time │
  │questions │  │download  │ │recommend.│ │confirm   │
  └────┬─────┘  └──────────┘ └──────────┘ └──────────┘
       │
       ▼
  ┌──────────┐
  │ RESULTS  │
  │score ring│
  │breakdown │──────► AI Agent (for recommendations)
  │KB insight│──────► Booking (for consultant)
  │export    │──────► Diagnostic (retake)
  └──────────┘

  ┌─────────────────────── ADMIN ONLY ───────────────────┐
  │                                                       │
  │  ┌──────────────┐  ┌──────────┐  ┌──────────────┐   │
  │  │KNOWLEDGE BASE│  │ADMIN/CRM │  │ CONSULTANT   │   │
  │  │upload docs   │  │(future)  │  │  PORTAL      │   │
  │  │manage files  │  │          │  │  (future)    │   │
  │  │powers: diag, │  └──────────┘  └──────────────┘   │
  │  │results, agent│                                    │
  │  └──────────────┘                                    │
  └──────────────────────────────────────────────────────┘
```
