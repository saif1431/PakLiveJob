# 📋 PROJECT REQUIREMENTS DOCUMENT

## PakJobs Live - Pakistan Ka Real-Time Job Platform

---

## 🎯 PROJECT OVERVIEW

**Project Name:** PakJobs Live  
**Version:** 1.0 (MVP)  
**Status:** Development  
**Created:** May 2026  
**Target Launch:** 30 days

### Purpose

Ek real-time job aggregator platform jo Pakistan aur remote jobs ko filter karke show kare — zero signup, zero hassle. Job seekers ko fresh jobs har 2 ghante mein alert diya jaye.

### Business Goals

- Job seekers ko time-waste na ho manually scrolling se
- Pakistan-specific jobs + remote jobs ek jagah
- Completely free aur fast
- Monetization (later): Affiliate links, premium alerts

---

---

# 📊 FUNCTIONAL REQUIREMENTS

## F1: Job Display & Dashboard

### What It Does:

User jab website open kare, usse immediately 10-15 latest jobs dikhe.

### Features Required:

```
✓ Job list dikhaye with:
  - Job Title (e.g., "Senior Frontend Developer")
  - Company Name
  - Location (e.g., "Karachi, Pakistan" or "Remote")
  - Posted Time Badge ("2 hours ago", "30 minutes ago")
  - Salary (agar available ho)
  - Direct link to original job posting

✓ Every job card clickable → original job URL par redirect
✓ List auto-refresh har 2 ghante (silently, user notice na kare)
✓ "Last updated: 45 minutes ago" footer show ho
```

---

## F2: Filtering System

### What It Does:

User apne preferences ke hisaab se jobs filter kar sake.

### Filters Required:

```
Filter 1: JOB TITLE
├─ Frontend Developer
├─ Backend Developer
├─ Full Stack Developer
├─ AI Engineer
├─ DevOps Engineer
├─ Data Scientist
└─ All

Filter 2: LOCATION
├─ Islamabad
├─ Karachi
├─ Lahore
├─ Peshawar
├─ Remote
├─ All

Filter 3: TIME POSTED
├─ Last 1 Hour
├─ Last 6 Hours
├─ Last 24 Hours
└─ All Time

Implementation:
✓ Multiple filters at same time (e.g., Frontend + Karachi + Last 6 hrs)
✓ Filters apply instantly (no "Search" button)
✓ Browser localStorage mein save ("Remember my filters")
✓ Clear All Filters button
```

---

## F3: Job Data Fetching & Updates

### What It Does:

Backend har 2 ghante mein automatically naye jobs fetch kare from multiple sources.

### Requirements:

```
✓ Fetch jobs from:
  - Remotive API (Remote tech jobs)
  - Adzuna API (Pakistan + International jobs)
  - (Optional later: JSearch, Jobicy)

✓ Detect duplicates (same job URL = duplicate)
✓ Store in database with metadata:
  - Job ID
  - Title, Company, Location
  - Posted Timestamp
  - Source (Remotive/Adzuna)
  - Direct URL

✓ Auto-delete jobs older than 7 days
✓ Keep database size optimized

Frequency: Every 2 hours (Cron job)
```

---

## F4: Search Functionality

### What It Does:

User "Frontend" type kare to relevant jobs filter ho jaye.

### Requirements:

```
✓ Real-time search (type karte hi results update ho)
✓ Search by:
  - Job Title (keyword match)
  - Company Name
  - Location name

✓ Case-insensitive search
✓ Highlight matched text in results
```

---

## F5: Mobile Responsiveness

### What It Does:

Kaam mobile par bhi perfectly ho.

### Requirements:

```
✓ Mobile-first design
✓ Filters stack vertically on mobile
✓ Touch-friendly buttons (min 44x44px)
✓ Full-width job cards
✓ Bottom navigation (Filter | Search | More)
✓ Works on: iPhone, Android, tablets
```

---

## F6: Performance & UX

### What It Does:

Fast load time, smooth experience.

### Requirements:

```
✓ Page load < 2 seconds
✓ Filter apply < 500ms
✓ No lag when scrolling
✓ Pagination: Show 15 jobs per page (load more button)
✓ Skeleton loaders jab data fetch ho raha ho
✓ Error messages clear ho (e.g., "No jobs found for your filters")
```

---

## F7: Analytics (Optional Phase 2)

### Not in MVP, but plan for:

```
- Most searched job titles
- Most filtered locations
- Peak browsing hours
- User retention
```

---

---

# 🛠️ TECHNICAL REQUIREMENTS

## T1: Frontend Framework

### What Needed:

```
✓ React-based framework with SSR (Server-Side Rendering)
✓ Component library for reusable UI
✓ State management for filters
✓ Responsive CSS-in-JS or Tailwind
✓ Real-time filtering (no page reload)
```

---

## T2: Backend / API Layer

### What Needed:

```
✓ API to serve jobs to frontend
  - GET /api/jobs → fetch with filters
  - GET /api/jobs/:id → single job details

✓ Cron job endpoint
  - POST /api/fetch-jobs → trigger job fetching
  (Runs every 2 hours automatically)

✓ Job sources integration
  - Call Remotive API
  - Call Adzuna API
  - Handle API errors gracefully

✓ Error handling & logging
  - Log failed API calls
  - Retry logic (3 attempts)
```

---

## T3: Database Schema

### What Needed:

```sql
TABLE: jobs
├─ id (UUID, Primary Key)
├─ title (String, indexed)
├─ company (String)
├─ location (String, indexed)
├─ job_type (String: "Remote" / "On-Site" / "Hybrid")
├─ salary (String, nullable)
├─ description (Text)
├─ source (String: "Remotive" / "Adzuna")
├─ source_job_id (String, unique)
├─ job_url (String, unique) ← IMPORTANT for duplicate check
├─ posted_at (DateTime, indexed)
├─ fetched_at (DateTime)
├─ is_active (Boolean, default: true)

Indexes:
✓ title (for search)
✓ location (for filter)
✓ posted_at (for time-based sorting)
✓ job_url (for duplicate prevention)
```

---

## T4: Third-Party API Integrations

### API 1: Remotive

```
Endpoint: https://remotive.com/api/remote-jobs
Method: GET
Auth: None required ✓
Cost: FREE
Response: JSON with jobs array
Rate Limit: Generous (no explicit limit stated)
Data: Remote jobs, tech-focused
Refresh: Call every 2 hours
```

### API 2: Adzuna

```
Endpoint: https://api.adzuna.com/v1/api/jobs/pk/search
Method: GET
Auth: API Key required (free signup)
Cost: FREE tier = 250 requests/day
Response: JSON with jobs array
Parameters:
├─ what: job title filter
├─ where: location filter
├─ country: "pk" for Pakistan
├─ results_per_page: 50
└─ page: pagination
```

### API 3: JSearch (Optional, Phase 2)

```
Status: Not in MVP
Future: For more job variety
Platform: RapidAPI
Cost: ~$0.01 per request
```

---

## T5: Security Requirements

### What Needed:

```
✓ HTTPS only (automatic on Vercel)
✓ Rate limiting on API endpoints
  - Prevent abuse from fetch-jobs endpoint
  - Limit: 100 requests per IP per hour

✓ Input validation
  - Sanitize filter inputs
  - No SQL injection possible (use ORM)

✓ Environment variables
  - API keys NOT in code
  - Use .env.local (git-ignored)

✓ No user data storage
  - No login = no personal data to protect
  - GDPR compliant by default
```

---

## T6: Cron / Scheduled Tasks

### What Needed:

```
Task 1: Fetch New Jobs
├─ Trigger: Every 2 hours (0 */2 * * *)
├─ Duration: ~30 seconds per call
├─ Action:
│  ├─ Call Remotive API
│  ├─ Call Adzuna API
│  ├─ Check for duplicates by job_url
│  └─ Insert new jobs to DB
└─ Failure: Log error, retry in 30 min

Task 2: Cleanup Old Jobs
├─ Trigger: Daily at midnight (0 0 * * *)
├─ Action: Delete jobs older than 7 days
└─ Reason: Keep DB clean and under 500MB
```

---

---

# 🏗️ TECH STACK (DETAILED)

## TIER 1: Frontend Framework

| Component         | Technology               | Why This?                                  | Cost |
| ----------------- | ------------------------ | ------------------------------------------ | ---- |
| **Framework**     | Next.js 14+ (App Router) | Full-stack, SSR, free deployment on Vercel | FREE |
| **Rendering**     | SSG + ISR                | Pages pre-build + revalidate every 2 hrs   | FREE |
| **React Version** | React 18+                | Built-in with Next.js                      | FREE |
| **Language**      | TypeScript               | Type-safe, catches bugs early              | FREE |

---

## TIER 2: Styling & Components

| Component             | Technology               | Why This?                                        | Cost |
| --------------------- | ------------------------ | ------------------------------------------------ | ---- |
| **CSS Framework**     | Tailwind CSS 3+          | Fast, utility-first, great for responsive design | FREE |
| **Component Library** | Headless UI / shadcn/ui  | Pre-built accessible components                  | FREE |
| **Icons**             | Lucide Icons             | Clean, modern SVG icons                          | FREE |
| **Animations**        | Framer Motion (optional) | Smooth transitions, micro-interactions           | FREE |

---

## TIER 3: State Management & Data Fetching

| Component         | Technology                   | Why This?                        | Cost |
| ----------------- | ---------------------------- | -------------------------------- | ---- |
| **State**         | React Context + useReducer   | Simple, no extra dependencies    | FREE |
| **Data Fetching** | Axios (or built-in `fetch`)  | Simple HTTP calls                | FREE |
| **Data Cache**    | SWR / React Query (optional) | Auto-revalidate, background sync | FREE |
| **Local Storage** | Browser localStorage         | Client-side filter persistence   | FREE |

---

## TIER 4: Backend & Runtime

| Component            | Technology         | Why This?              | Cost |
| -------------------- | ------------------ | ---------------------- | ---- |
| **Runtime**          | Node.js 18+ LTS    | JavaScript on server   | FREE |
| **Server Framework** | Next.js API Routes | No extra server needed | FREE |
| **Environment**      | Vercel             | Next.js native hosting | FREE |

---

## TIER 5: Database & ORM

| Component          | Technology            | Why This?                             | Cost                  |
| ------------------ | --------------------- | ------------------------------------- | --------------------- |
| **Database**       | Supabase (PostgreSQL) | Managed, free tier 500MB, free SDK    | FREE (first 6 months) |
| **ORM**            | Prisma                | Type-safe DB queries, auto-migrations | FREE                  |
| **Alternative DB** | PlanetScale (MySQL)   | Free tier 5GB (backup option)         | FREE                  |

---

## TIER 6: Authentication & Authorization

| Component   | Technology                | Why This?                  | Cost |
| ----------- | ------------------------- | -------------------------- | ---- |
| **Auth**    | None required ✓           | No login needed for MVP    | FREE |
| **Session** | Browser localStorage only | Track filters, preferences | FREE |
| **Future**  | Clerk / Auth0 (if needed) | If premium features added  | PAID |

---

## TIER 7: Deployment & Hosting

| Component                      | Technology                            | Why This?                                    | Cost               |
| ------------------------------ | ------------------------------------- | -------------------------------------------- | ------------------ |
| **Frontend + Backend Hosting** | Vercel                                | Native Next.js support, auto-deploy from Git | FREE               |
| **Git Repository**             | GitHub                                | Version control, CI/CD                       | FREE               |
| **Domain**                     | Namecheap / GoDaddy (optional)        | Custom domain                                | ~Rs. 500-2000/year |
| **DNS**                        | Vercel DNS                            | Automatic                                    | FREE               |
| **Email**                      | SendGrid (for notifications, Phase 2) | Send job alerts                              | FREE (500/month)   |

---

## TIER 8: Monitoring & Analytics

| Component                  | Technology                    | Why This?                 | Cost            |
| -------------------------- | ----------------------------- | ------------------------- | --------------- |
| **Error Tracking**         | Vercel Analytics              | Built-in, basic           | FREE            |
| **Logging**                | Console + Vercel Logs         | Debug in production       | FREE            |
| **Performance Monitoring** | Next.js built-in              | Web Vitals tracking       | FREE            |
| **Advanced Analytics**     | Plausible (optional, Phase 2) | Privacy-focused analytics | PAID ($9/month) |

---

## TIER 9: External APIs & Services

| Component        | Technology        | Auth           | Cost      | Rate Limit   |
| ---------------- | ----------------- | -------------- | --------- | ------------ |
| **Job Source 1** | Remotive API      | None           | FREE      | Generous     |
| **Job Source 2** | Adzuna API        | API Key (free) | FREE tier | 250 req/day  |
| **Job Source 3** | JSearch (Phase 2) | RapidAPI key   | $0.01/req | Variable     |
| **Cron Service** | Vercel Cron       | Built-in       | FREE      | 6/hour limit |

---

## TIER 10: Development Tools

| Tool                     | Purpose                                | Cost |
| ------------------------ | -------------------------------------- | ---- |
| **IDE**                  | VS Code                                | FREE |
| **Node Package Manager** | npm / pnpm                             | FREE |
| **Linting**              | ESLint                                 | FREE |
| **Code Formatting**      | Prettier                               | FREE |
| **Git Hooks**            | Husky                                  | FREE |
| **Testing**              | Jest + React Testing Library (Phase 2) | FREE |

---

---

# 📦 COMPLETE TECH STACK AT A GLANCE

```
┌─────────────────────────────────────────────────────────────┐
│                      PAKJOBS LIVE STACK                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND LAYER                                              │
│  ├─ Next.js 14+ (React 18 + TypeScript)                    │
│  ├─ Tailwind CSS 3 + Headless UI                           │
│  └─ Lucide Icons                                            │
│                                                              │
│  STATE & DATA LAYER                                          │
│  ├─ React Context (filters, theme)                         │
│  ├─ localStorage (filter persistence)                       │
│  └─ Axios (API calls)                                       │
│                                                              │
│  BACKEND LAYER                                               │
│  ├─ Next.js API Routes (/api/*)                            │
│  └─ Node.js 18+ Runtime                                     │
│                                                              │
│  DATABASE LAYER                                              │
│  ├─ Supabase (PostgreSQL)                                  │
│  └─ Prisma ORM                                              │
│                                                              │
│  EXTERNAL SERVICES                                           │
│  ├─ Remotive API (free, remote jobs)                       │
│  ├─ Adzuna API (free key, Pakistan jobs)                   │
│  └─ Vercel Cron (scheduling)                                │
│                                                              │
│  DEPLOYMENT                                                  │
│  ├─ Vercel (frontend + backend + serverless)               │
│  └─ GitHub (version control + CI/CD)                       │
│                                                              │
│  TOTAL COST (First 6 months): $0                            │
│  After 6 months: ~$25/month (Supabase Pro, optional)       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

---

# 🚀 SYSTEM ARCHITECTURE DIAGRAM

```
┌──────────────────────────────────────────────────────────────────┐
│                     USER (Job Seeker)                             │
│                   Browser / Mobile App                            │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Vercel CDN   │
                    │  (Fast global)  │
                    └────────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
     ┌──────▼──────┐  ┌─────▼─────┐ ┌──────▼──────┐
     │ Next.js     │  │API Routes │ │ Static      │
     │ Frontend    │  │ (/api/*)  │ │ Pages (SSG) │
     │ (React)     │  └─────┬─────┘ └─────────────┘
     └──────┬──────┘        │
            │               │
            └───────────────┼──────────────────┐
                            │                  │
                     ┌──────▼──────┐    ┌──────▼──────┐
                     │ Supabase    │    │ External    │
                     │ PostgreSQL  │    │ APIs        │
                     │ (jobs table)│    │ (Remotive   │
                     │             │    │  Adzuna)    │
                     └─────────────┘    └─────────────┘
                            ▲
                            │
                     ┌──────┴──────┐
                     │ Cron Job    │
                     │ (Every 2 hr)│
                     └─────────────┘
```

---

---

# 📋 COMPONENT INVENTORY (What Gets Built)

## Frontend Components

```
src/components/
├─ JobCard.tsx
│  ├─ Displays: Title, Company, Location, Time
│  └─ Props: job object, onClick handler
│
├─ JobList.tsx
│  ├─ Maps jobs array to JobCard
│  └─ Pagination (15 jobs per page)
│
├─ FilterBar.tsx
│  ├─ Job Title dropdown
│  ├─ Location dropdown
│  ├─ Time posted dropdown
│  └─ Clear All button
│
├─ SearchBox.tsx
│  ├─ Real-time search input
│  └─ Auto-focus on mount
│
├─ Header.tsx
│  ├─ Logo "PakJobs Live"
│  ├─ Last updated timestamp
│  └─ Refresh button
│
└─ Layout.tsx
   ├─ Wrapper for all pages
   └─ Header, Footer, Navigation
```

---

## Backend API Routes

```
app/api/
├─ jobs/
│  ├─ route.ts (GET)
│  │  ├─ Fetch jobs from Supabase
│  │  ├─ Apply filters (title, location, time)
│  │  ├─ Apply search (keyword)
│  │  ├─ Return paginated results
│  │  └─ Response: { jobs: [], total: 150, page: 1 }
│  │
│  └─ [id]/
│     └─ route.ts (GET)
│        ├─ Fetch single job by ID
│        └─ Response: { job: {...} }
│
├─ fetch-jobs/
│  └─ route.ts (POST)
│     ├─ Call Remotive API
│     ├─ Call Adzuna API
│     ├─ Deduplicate by job_url
│     ├─ Insert new jobs to Supabase
│     ├─ Delete old jobs (>7 days)
│     └─ Response: { added: 25, skipped: 12 }
│
└─ health/
   └─ route.ts (GET)
      ├─ Check API status
      └─ Used for monitoring
```

---

## Database Tables

```
Supabase Project: pakjobs-live

Table 1: jobs
├─ id: UUID (Primary Key)
├─ title: text (indexed)
├─ company: text
├─ location: text (indexed)
├─ job_type: text (Remote/On-Site/Hybrid)
├─ salary: text (nullable)
├─ description: text
├─ source: text (Remotive/Adzuna)
├─ source_job_id: text (unique)
├─ job_url: text (unique, indexed) ← CRITICAL
├─ posted_at: timestamp (indexed)
├─ fetched_at: timestamp
├─ is_active: boolean
└─ created_at: timestamp (default now())

Indexes:
├─ idx_title (for search)
├─ idx_location (for filtering)
├─ idx_posted_at (for sorting)
└─ idx_job_url (for duplicate prevention)
```

---

---

# 📦 DEPENDENCIES & PACKAGES

## Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "@supabase/supabase-js": "^2.38.0",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "lucide-react": "^0.292.0"
  },

  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.0.0",
    "prettier": "^3.1.0"
  }
}
```

---

---

# 🔄 DATA FLOW DIAGRAMS

## Flow 1: User Opens Website

```
1. User opens pakjobs-live.vercel.app
2. Next.js serves pre-built HTML (SSG)
3. React hydrates on client
4. useEffect triggers: "Load jobs"
5. Axios calls GET /api/jobs
6. API queries Supabase:
   SELECT * FROM jobs WHERE is_active=true ORDER BY posted_at DESC
7. Jobs returned to frontend
8. useState(jobs) set
9. JobList component renders
10. User sees 15 latest jobs instantly
```

---

## Flow 2: User Filters (e.g., "Frontend + Karachi + Last 6 hrs")

```
1. User selects filters via FilterBar
2. onChange triggers setFilters() in Context
3. useEffect listens to filters change
4. Axios calls GET /api/jobs?title=Frontend&location=Karachi&hours=6
5. API builds WHERE clause:
   WHERE title ILIKE '%frontend%'
   AND location ILIKE '%karachi%'
   AND posted_at > NOW() - INTERVAL '6 hours'
6. Results returned
7. useState(jobs) updated
8. JobList re-renders with filtered jobs
9. User sees only Frontend Karachi jobs from last 6 hrs
```

---

## Flow 3: Cron Job Fetches New Jobs (Every 2 Hours)

```
Vercel Cron Scheduler triggers /api/fetch-jobs
│
├─ 1. Call Remotive API
│  └─ Get ~50 remote jobs
│
├─ 2. Call Adzuna API with filters
│  └─ Get ~100 Pakistan jobs
│
├─ 3. Deduplicate
│  └─ For each job, check if job_url exists in DB
│     IF exists → skip
│     IF new → INSERT
│
├─ 4. Database Insert (Prisma)
│  └─ INSERT INTO jobs (title, company, location, ...)
│      VALUES (...)
│      ON CONFLICT (job_url) DO NOTHING
│
├─ 5. Cleanup
│  └─ DELETE FROM jobs WHERE posted_at < NOW() - INTERVAL '7 days'
│
└─ 6. Response
   └─ { added: 25 new, skipped: 15 duplicates, deleted: 8 old }
```

---

---

# ✅ NON-FUNCTIONAL REQUIREMENTS

## Performance

```
✓ Page Load: < 2 seconds (Google Lighthouse score > 90)
✓ Filter Apply: < 500ms
✓ API Response: < 1 second (Supabase query)
✓ Cron Execution: < 30 seconds
✓ Database Query Time: < 500ms (with indexes)
```

## Scalability

```
✓ Handle 1,000+ jobs in database
✓ Support 500+ concurrent users
✓ API rate limit: 100 req/IP/hour
✓ Database auto-scaling (Supabase handles it)
```

## Reliability

```
✓ 99.5% uptime target (Vercel SLA: 99.95%)
✓ Graceful API failure handling (show cached jobs)
✓ Cron retry logic (3 attempts if API fails)
✓ Error logging & monitoring
```

## Security

```
✓ HTTPS only
✓ No user data collection (GDPR compliant)
✓ Input validation on all filters
✓ API keys in environment variables (not hardcoded)
✓ SQL injection prevention (Prisma + Supabase)
```

## Usability

```
✓ Mobile-first responsive design
✓ Keyboard navigation support
✓ Clear error messages
✓ Accessible (WCAG 2.1 AA standard)
```

---

---

# 🎯 PHASE-WISE BREAKDOWN

## Phase 1: MVP (Days 1-5)

- Next.js setup
- Supabase database schema
- Remotive API integration
- Basic job list + filters
- Deploy to Vercel
- Cost: $0

## Phase 2: Enhancement (Days 6-15)

- Adzuna API integration
- Search functionality
- Better UI/UX polish
- Mobile optimization
- Cost: $0

## Phase 3: Features (Days 16-30)

- Performance optimization
- Analytics integration
- Job alerts (email)
- Saved filters
- Cost: $0

## Phase 4+: Growth (Month 2+)

- Database optimization (if scaling)
- Supabase Pro ($25/month) if needed
- Monetization (ads, affiliate)
- Admin dashboard

---

---

# 📞 APPENDIX: API Documentation

## GET /api/jobs

Fetch jobs with optional filters

**Query Parameters:**

```
?title=Frontend         (job title filter)
&location=Karachi      (location filter)
&hours=6               (posted within N hours)
&page=1                (pagination)
&limit=15              (items per page)
&search=react          (keyword search)
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "title": "Senior Frontend Developer",
      "company": "TechCorp Pakistan",
      "location": "Karachi, Pakistan",
      "job_type": "Remote",
      "salary": "Rs. 150,000 - 250,000",
      "posted_at": "2026-05-31T10:30:00Z",
      "job_url": "https://linkedin.com/jobs/123456",
      "source": "Adzuna"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 247,
    "pages": 17
  }
}
```

---

## POST /api/fetch-jobs

Trigger job fetching from external APIs (Cron-triggered)

**Response:**

```json
{
  "success": true,
  "statistics": {
    "remotive_fetched": 50,
    "adzuna_fetched": 100,
    "duplicates_skipped": 15,
    "new_jobs_added": 125,
    "old_jobs_deleted": 8,
    "total_jobs_in_db": 1250,
    "execution_time_ms": 28000
  }
}
```

---

---

# 🏁 SUMMARY TABLE

| Requirement Type       | Details                            | Status |
| ---------------------- | ---------------------------------- | ------ |
| **Frontend Framework** | Next.js 14 + React 18 + TypeScript | ✅     |
| **Styling**            | Tailwind CSS + Headless UI         | ✅     |
| **Backend**            | Next.js API Routes                 | ✅     |
| **Database**           | Supabase PostgreSQL                | ✅     |
| **ORM**                | Prisma                             | ✅     |
| **Job Sources**        | Remotive + Adzuna APIs             | ✅     |
| **Scheduling**         | Vercel Cron (every 2 hrs)          | ✅     |
| **Hosting**            | Vercel                             | ✅     |
| **Version Control**    | GitHub                             | ✅     |
| **Domain**             | Optional (later)                   | 📋     |
| **Email Alerts**       | SendGrid (Phase 2)                 | 📋     |
| **Total MVP Cost**     | $0                                 | ✅     |

---

**Document Status:** ✅ READY FOR DEVELOPMENT  
**Last Updated:** May 31, 2026  
**Next Review:** After Phase 1 completion
