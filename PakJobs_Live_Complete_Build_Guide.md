# 🚀 PAKJOBS LIVE - COMPLETE STEP-BY-STEP BUILD GUIDE
## Full Implementation with Supabase, APIs, and Code Examples

---

# ⚠️ IMPORTANT - READ FIRST

This guide covers:
- ✅ Setting up Supabase (free, no credit card if you use free tier)
- ✅ Getting 3 Job APIs (Remotive + Adzuna + JSearch)
- ✅ Complete code for backend, frontend, and database
- ✅ All 3 APIs feeding jobs simultaneously into one dashboard
- ✅ Deployment on Vercel (free)

**Time to Complete:** 5-7 days for solo developer  
**Total Cost:** $0 (guaranteed for first 6 months)

---

---

# STEP 1: PROJECT INITIALIZATION & SETUP
## Duration: 30 minutes | Difficulty: ⭐ Easy

### What You'll Do:
Create a new Next.js project with all necessary packages installed.

### Prerequisites:
- Node.js installed (v18+) → Download from nodejs.org
- Git installed → Download from git-scm.com
- GitHub account (free) → Sign up at github.com
- VS Code (optional but recommended) → Download from code.visualstudio.com

### Detailed Instructions:

#### 1.1: Create Next.js Project
Open your terminal/command prompt and run:

```bash
npx create-next-app@latest pakjobs-live --typescript --tailwind --app --eslint

# When prompted, select these options:
# ✓ TypeScript? → Yes
# ✓ ESLint? → Yes
# ✓ Tailwind CSS? → Yes
# ✓ App Router? → Yes
# ✓ src/ directory? → No
# ✓ import alias? → @/* (default)
```

What happens:
- Creates `pakjobs-live` folder
- Installs Next.js, React, Tailwind, TypeScript
- Sets up folder structure automatically

#### 1.2: Navigate to Project
```bash
cd pakjobs-live
```

#### 1.3: Install Required Packages
```bash
npm install @supabase/supabase-js axios date-fns prisma @prisma/client lucide-react
```

What you're installing:
- `@supabase/supabase-js` → Connect to Supabase database
- `axios` → Make HTTP calls to job APIs
- `date-fns` → Format dates (e.g., "2 hours ago")
- `prisma` → Database ORM (type-safe queries)
- `@prisma/client` → Prisma client
- `lucide-react` → Icons for UI

#### 1.4: Verify Installation
```bash
npm run dev
```

What should happen:
- Terminal shows: `> ready - started server on 0.0.0.0:3000`
- Open http://localhost:3000 in browser
- Should see Next.js welcome page

**If it works:** ✅ Move to Step 2  
**If it fails:** Check error message, make sure Node.js is v18+

---

---

# STEP 2: SUPABASE SETUP & DATABASE CREATION
## Duration: 45 minutes | Difficulty: ⭐⭐ Medium

### What You'll Do:
Create a Supabase account, project, and database table to store jobs.

### 2.1: Create Supabase Account

1. **Go to:** https://supabase.com
2. **Click:** "Start your project" or "Sign Up"
3. **Choose:** "Sign up with GitHub" (easiest method)
   - Click "Authorize supabase"
   - GitHub will ask permission, click "Authorize"
4. **Create Organization:**
   - Organization name: `pakjobs` (anything you want)
   - Click "Create organization"

**What you'll see:**
- Dashboard with "New Project" button

### 2.2: Create New Supabase Project

1. **Click:** "New Project" button
2. **Fill Form:**
   ```
   Project Name: pakjobs-live
   Database Password: [Strong password - save this!]
   Region: Choose closest to you (e.g., Singapore if in Pakistan)
   ```
3. **Click:** "Create new project"

**Wait:** 2-3 minutes for project to initialize

**What you'll see:**
- Dashboard with API keys and database connection info

### 2.3: Get Your API Keys

Once project is created:

1. **Go to:** Settings → API in left sidebar
2. **Look for:**
   - `NEXT_PUBLIC_SUPABASE_URL` (starts with https://...supabase.co)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (long alphanumeric string)

**Copy these values - you'll need them soon**

### 2.4: Create Database Table

1. **Go to:** SQL Editor (left sidebar)
2. **Click:** "New Query"
3. **Paste this SQL:**

```sql
-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT, -- 'Remote', 'On-Site', 'Hybrid'
  salary TEXT, -- nullable
  description TEXT,
  source TEXT NOT NULL, -- 'Remotive', 'Adzuna', 'JSearch'
  source_job_id TEXT UNIQUE,
  job_url TEXT UNIQUE NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_jobs_title ON jobs(title);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_jobs_job_url ON jobs(job_url);
CREATE INDEX idx_jobs_source ON jobs(source);
```

4. **Click:** "Run" button (blue button on right)

**What you should see:**
- "Successfully executed" message
- No errors

### 2.5: Verify Table Creation

1. **Go to:** Table Editor (left sidebar)
2. **Click:** "jobs" table
3. Should see columns: id, title, company, location, job_type, salary, etc.

**If you see all columns:** ✅ Supabase is ready  
**If not:** Re-run the SQL query, check for errors

---

---

# STEP 3: SETTING UP THREE JOB APIS
## Duration: 60 minutes | Difficulty: ⭐⭐⭐ Medium-Hard

### What You'll Do:
Get API keys from 3 different job sources, so if one fails, others still provide jobs.

---

## 3A: REMOTIVE API (Easiest - No Key Needed)

### What is it?
Free API for remote tech jobs worldwide. No authentication required.

### Setup Steps:

1. **API Endpoint:** 
   ```
   https://remotive.com/api/remote-jobs
   ```

2. **No signup needed!** Use directly in code

3. **How to test it:**
   - Open browser → paste this URL
   - You'll see JSON with remote jobs
   - Each job has: title, company, location, job_url, posted_date

4. **API Limits:**
   - No rate limit publicly stated
   - But don't call more than 5 times per hour to be safe

5. **What you get:**
   ```json
   {
     "jobs": [
       {
         "id": 123,
         "title": "Senior Frontend Developer",
         "company": "TechCorp",
         "url": "https://example.com/job",
         "posted_date": "2026-05-31T10:00:00Z",
         "description": "..."
       }
     ]
   }
   ```

**Save for later:** You'll use this in backend code (Step 5)

---

## 3B: ADZUNA API (Powerful - Requires Free Key)

### What is it?
Largest job aggregator. Searches 50+ job sites. Has Pakistan-specific jobs.

### Setup Steps:

1. **Go to:** https://developer.adzuna.com/signup
2. **Sign up:**
   - Email: Your email
   - Password: Create strong password
   - Click "Create Account"
3. **Verify Email:** Check inbox, click verification link
4. **Login:** https://developer.adzuna.com/login
5. **Get API Key:**
   - Go to "Applications" in dashboard
   - Click "Create New Application"
   - Name: `pakjobs-live`
   - Description: `Pakistan job aggregator`
   - Click "Create"
   - **Copy your API Key** (long string)

### API Details:

**Endpoint:**
```
https://api.adzuna.com/v1/api/jobs/{country}/search/1
```

**Required Parameters:**
```
app_id = YOUR_APP_ID (provided after signup)
app_key = YOUR_API_KEY (what you just copied)
what = (job title, e.g., "Frontend Developer")
where = (location, e.g., "Karachi")
country = (e.g., "pk" for Pakistan)
results_per_page = 50
```

**Example URL:**
```
https://api.adzuna.com/v1/api/jobs/pk/search/1?
app_id=YOUR_APP_ID&
app_key=YOUR_API_KEY&
what=Frontend&
where=Karachi&
results_per_page=50
```

### Test It:
1. Go to https://api.adzuna.com/api-docs
2. In "Search Jobs" section, fill in:
   - country: `pk`
   - app_id: Your app ID
   - app_key: Your API key
   - what: `developer`
3. Click "Try it out"
4. Should see JSON response with jobs

**Rate Limits:**
- Free tier: 250 requests/day
- For MVP this is MORE than enough

**Save for later:** app_id and app_key

---

## 3C: JSEARCH API (Backup - Most Complete)

### What is it?
LinkedIn + Indeed + Glassdoor job data combined. Very powerful but costs money after free calls.

### Setup Steps:

1. **Go to:** https://rapidapi.com/laimoon-laimoon-rest-api/api/jsearch
2. **Click:** "Subscribe Free"
3. **Sign up:**
   - Email: Your email
   - Password: Create password
4. **Verify email** (check inbox)
5. **Login** to RapidAPI
6. **Go back to:** JSearch API page
7. **Click:** "Subscribe to this API"
8. **Select:** "Free" plan (left side)
9. **Click:** "Subscribe"
10. **Get API Key:**
    - Go to your account → Applications
    - Click on the app
    - Copy "X-RapidAPI-Key"

### API Details:

**Endpoint:**
```
https://jsearch.p.rapidapi.com/search
```

**Required Headers:**
```
X-RapidAPI-Host: jsearch.p.rapidapi.com
X-RapidAPI-Key: YOUR_KEY_HERE
```

**Parameters:**
```
query = "Frontend Developer in Karachi"
page = 1
num_pages = 1
```

### Test It:
1. Go to https://rapidapi.com/laimoon-laimoon-rest-api/api/jsearch
2. Scroll down to "API Playground"
3. In query field, enter: `Frontend Developer`
4. Click "Test Endpoint"
5. Should see JSON with jobs from multiple sources

**Free Tier Limits:**
- 100 requests/month (enough for testing)
- After that: ~$0.01 per request

**Why use it:**
- If Remotive/Adzuna fail, this is backup
- Most comprehensive data

**Save for later:** Your X-RapidAPI-Key

---

## 3D: Create Environment Variables File

In your project root, create `.env.local` file:

```bash
# In pakjobs-live folder, create .env.local file
touch .env.local
```

**Paste these variables into `.env.local`:**

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Adzuna API
ADZUNA_APP_ID=YOUR_APP_ID_HERE
ADZUNA_APP_KEY=YOUR_API_KEY_HERE

# JSearch API (RapidAPI)
JSEARCH_API_KEY=YOUR_JSEARCH_KEY_HERE
JSEARCH_API_HOST=jsearch.p.rapidapi.com

# Remotive (no key needed, but we include for reference)
REMOTIVE_API_URL=https://remotive.com/api/remote-jobs
```

**Important:** 
- Replace YOUR_... with actual values
- Never commit `.env.local` to GitHub (it's in .gitignore by default)
- Keep these secret!

---

---

# STEP 4: PRISMA DATABASE SETUP & INITIALIZATION
## Duration: 30 minutes | Difficulty: ⭐⭐ Medium

### What You'll Do:
Configure Prisma ORM to connect to Supabase and auto-generate database client.

### 4.1: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/` folder
- `prisma/schema.prisma` file

### 4.2: Configure Database Connection

Open `prisma/schema.prisma` and replace everything with:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Job {
  id            String   @id @default(cuid())
  title         String
  company       String
  location      String
  jobType       String? // "Remote", "On-Site", "Hybrid"
  salary        String? // nullable
  description   String?
  source        String  // "Remotive", "Adzuna", "JSearch"
  sourceJobId   String? @unique
  jobUrl        String  @unique
  postedAt      DateTime?
  fetchedAt     DateTime @default(now())
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  @@index([title])
  @@index([location])
  @@index([postedAt])
  @@index([jobUrl])
  @@index([source])
}
```

### 4.3: Update .env.local with DATABASE_URL

Add this to your `.env.local`:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres?schema=public"
```

**How to find this:**
1. Go to Supabase dashboard
2. Click "Connect" button (top right)
3. Select "URI" tab
4. Copy the connection string
5. Replace `[PASSWORD]` with your database password from Step 2

**Your .env.local now should have:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=postgresql://...

# APIs
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
JSEARCH_API_KEY=...
```

### 4.4: Generate Prisma Client

```bash
npx prisma generate
```

What happens:
- Reads your schema
- Generates TypeScript types
- Creates PrismaClient for database queries

### 4.5: Verify Connection

```bash
npx prisma db push
```

If successful, you'll see:
```
✓ Pushed to database successfully
```

If it says "already pushed", that's fine - it means your schema matches Supabase.

---

---

# STEP 5: BACKEND API ROUTES - FETCH JOBS
## Duration: 90 minutes | Difficulty: ⭐⭐⭐ Hard

### What You'll Do:
Create API endpoints that fetch jobs from 3 sources and save to database.

---

## 5A: Create Supabase Client Library

Create file: `lib/supabase.ts`

```bash
mkdir -p lib
touch lib/supabase.ts
```

**Paste this code into `lib/supabase.ts`:**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

What this does:
- Connects to Supabase using your credentials
- Makes it reusable across your app

---

## 5B: Create Job API Service

Create file: `lib/jobApis.ts`

```bash
touch lib/jobApis.ts
```

**Paste this code into `lib/jobApis.ts`:**

```typescript
import axios from 'axios'

// Types
interface RawJob {
  id?: string | number
  title: string
  company: string
  location: string
  job_type?: string
  salary?: string
  description?: string
  url?: string
  job_url?: string
  posted_date?: string
  postedAt?: string
  job_posted_date?: string
}

export interface ParsedJob {
  title: string
  company: string
  location: string
  jobType: string
  salary?: string
  description?: string
  source: 'Remotive' | 'Adzuna' | 'JSearch'
  sourceJobId?: string
  jobUrl: string
  postedAt: Date
}

// ========== REMOTIVE API ==========
export async function fetchRemoitiveJobs(): Promise<ParsedJob[]> {
  try {
    console.log('Fetching from Remotive...')
    
    const response = await axios.get(
      'https://remotive.com/api/remote-jobs?limit=50'
    )

    const jobs = response.data.jobs || []

    return jobs.map((job: RawJob) => ({
      title: job.title || 'Unknown',
      company: job.company || 'Unknown Company',
      location: job.location || 'Remote',
      jobType: 'Remote',
      salary: job.salary || undefined,
      description: job.description,
      source: 'Remotive' as const,
      sourceJobId: String(job.id),
      jobUrl: job.url || '',
      postedAt: new Date(job.posted_date || new Date()),
    })).filter(job => job.jobUrl) // Remove jobs without URL

  } catch (error) {
    console.error('Remotive API Error:', error)
    return []
  }
}

// ========== ADZUNA API ==========
export async function fetchAdzunaJobs(): Promise<ParsedJob[]> {
  try {
    console.log('Fetching from Adzuna...')
    
    const appId = process.env.ADZUNA_APP_ID
    const appKey = process.env.ADZUNA_APP_KEY

    if (!appId || !appKey) {
      console.error('Adzuna credentials missing')
      return []
    }

    // Fetch jobs from Pakistan
    const searchTerms = ['Developer', 'Engineer', 'AI']
    const locations = ['Karachi', 'Lahore', 'Islamabad']
    
    let allJobs: ParsedJob[] = []

    for (const search of searchTerms) {
      for (const location of locations) {
        try {
          const response = await axios.get(
            'https://api.adzuna.com/v1/api/jobs/pk/search/1',
            {
              params: {
                app_id: appId,
                app_key: appKey,
                what: search,
                where: location,
                results_per_page: 20,
                full_time: undefined,
              },
            }
          )

          const jobs = response.data.results || []

          const parsed = jobs.map((job: RawJob) => ({
            title: job.title || 'Unknown',
            company: job.company || 'Unknown Company',
            location: location,
            jobType: 'On-Site',
            salary: job.salary,
            description: job.description,
            source: 'Adzuna' as const,
            sourceJobId: String(job.id),
            jobUrl: job.job_url || '',
            postedAt: new Date(job.posted_date || new Date()),
          })).filter(job => job.jobUrl)

          allJobs = allJobs.concat(parsed)
        } catch (err) {
          console.error(`Adzuna search failed for ${search} in ${location}:`, err)
        }
      }
    }

    return allJobs

  } catch (error) {
    console.error('Adzuna API Error:', error)
    return []
  }
}

// ========== JSEARCH API ==========
export async function fetchJSearchJobs(): Promise<ParsedJob[]> {
  try {
    console.log('Fetching from JSearch...')
    
    const apiKey = process.env.JSEARCH_API_KEY
    const apiHost = process.env.JSEARCH_API_HOST

    if (!apiKey || !apiHost) {
      console.error('JSearch credentials missing')
      return []
    }

    const searchQueries = [
      'Frontend Developer Pakistan',
      'Backend Developer Pakistan',
      'Full Stack Developer remote',
      'AI Engineer Pakistan',
    ]

    let allJobs: ParsedJob[] = []

    for (const query of searchQueries) {
      try {
        const response = await axios.get(
          'https://jsearch.p.rapidapi.com/search',
          {
            params: {
              query: query,
              page: 1,
              num_pages: 1,
            },
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': apiHost,
            },
          }
        )

        const jobs = response.data.data || []

        const parsed = jobs.map((job: RawJob) => ({
          title: job.title || 'Unknown',
          company: job.company || 'Unknown Company',
          location: job.location || 'Remote',
          jobType: 'Remote',
          salary: job.salary,
          description: job.description,
          source: 'JSearch' as const,
          sourceJobId: String(job.id),
          jobUrl: job.job_url || '',
          postedAt: new Date(job.job_posted_date || new Date()),
        })).filter(job => job.jobUrl)

        allJobs = allJobs.concat(parsed)
      } catch (err) {
        console.error(`JSearch failed for "${query}":`, err)
      }
    }

    return allJobs

  } catch (error) {
    console.error('JSearch API Error:', error)
    return []
  }
}

// ========== MAIN FUNCTION: FETCH FROM ALL SOURCES ==========
export async function fetchAllJobs(): Promise<ParsedJob[]> {
  console.log('Starting job fetch from all sources...')

  // Fetch from all 3 APIs in parallel
  const [remoitiveJobs, adzunaJobs, jsearchJobs] = await Promise.allSettled([
    fetchRemoitiveJobs(),
    fetchAdzunaJobs(),
    fetchJSearchJobs(),
  ])

  const allJobs: ParsedJob[] = [
    ...(remoitiveJobs.status === 'fulfilled' ? remoitiveJobs.value : []),
    ...(adzunaJobs.status === 'fulfilled' ? adzunaJobs.value : []),
    ...(jsearchJobs.status === 'fulfilled' ? jsearchJobs.value : []),
  ]

  console.log(`Total jobs fetched: ${allJobs.length}`)
  console.log(`Remotive: ${remoitiveJobs.status === 'fulfilled' ? remoitiveJobs.value.length : 0}`)
  console.log(`Adzuna: ${adzunaJobs.status === 'fulfilled' ? adzunaJobs.value.length : 0}`)
  console.log(`JSearch: ${jsearchJobs.status === 'fulfilled' ? jsearchJobs.value.length : 0}`)

  return allJobs
}
```

**What this code does:**
- `fetchRemoitiveJobs()` - Gets remote jobs from Remotive
- `fetchAdzunaJobs()` - Searches Pakistan jobs on Adzuna
- `fetchJSearchJobs()` - Gets aggregated jobs from JSearch
- `fetchAllJobs()` - Combines all 3 sources, handles errors gracefully

---

## 5C: Create Database Save Function

Create file: `lib/jobDatabase.ts`

```bash
touch lib/jobDatabase.ts
```

**Paste this code into `lib/jobDatabase.ts`:**

```typescript
import { supabase } from './supabase'
import { ParsedJob } from './jobApis'

export interface JobToInsert {
  title: string
  company: string
  location: string
  job_type: string
  salary?: string | null
  description?: string | null
  source: string
  source_job_id?: string | null
  job_url: string
  posted_at: string
}

export async function saveJobsToDatabase(jobs: ParsedJob[]): Promise<{
  added: number
  skipped: number
  total: number
}> {
  if (jobs.length === 0) {
    return { added: 0, skipped: 0, total: 0 }
  }

  let added = 0
  let skipped = 0

  // Check which URLs already exist
  const jobUrls = jobs.map(j => j.jobUrl)
  
  const { data: existingJobs } = await supabase
    .from('jobs')
    .select('job_url')
    .in('job_url', jobUrls)

  const existingUrls = new Set(existingJobs?.map(j => j.job_url) || [])

  // Filter out duplicates
  const newJobs = jobs.filter(job => !existingUrls.has(job.jobUrl))

  // Prepare data for insertion
  const dataToInsert: JobToInsert[] = newJobs.map(job => ({
    title: job.title,
    company: job.company,
    location: job.location,
    job_type: job.jobType,
    salary: job.salary || null,
    description: job.description || null,
    source: job.source,
    source_job_id: job.sourceJobId || null,
    job_url: job.jobUrl,
    posted_at: job.postedAt.toISOString(),
  }))

  // Insert in batches of 50 to avoid timeout
  for (let i = 0; i < dataToInsert.length; i += 50) {
    const batch = dataToInsert.slice(i, i + 50)
    
    const { error } = await supabase
      .from('jobs')
      .insert(batch)

    if (error) {
      console.error('Error inserting batch:', error)
      // Continue with next batch instead of failing completely
    } else {
      added += batch.length
    }
  }

  skipped = jobs.length - added

  console.log(`Database update: Added ${added}, Skipped ${skipped}`)

  return { added, skipped, total: jobs.length }
}

export async function deleteOldJobs(): Promise<number> {
  // Delete jobs older than 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .lt('posted_at', sevenDaysAgo.toISOString())

  if (error) {
    console.error('Error deleting old jobs:', error)
    return 0
  }

  return data?.length || 0
}

export async function getJobStats() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (error) {
    console.error('Error getting stats:', error)
    return { total: 0, bySource: {} }
  }

  const jobs = data || []
  const bySource: { [key: string]: number } = {}

  jobs.forEach(job => {
    bySource[job.source] = (bySource[job.source] || 0) + 1
  })

  return { total: jobs.length, bySource }
}
```

**What this code does:**
- `saveJobsToDatabase()` - Saves jobs to Supabase (skips duplicates)
- `deleteOldJobs()` - Removes jobs older than 7 days
- `getJobStats()` - Returns count of jobs by source

---

## 5D: Create API Route - Fetch Jobs

Create file: `app/api/fetch-jobs/route.ts`

```bash
mkdir -p app/api/fetch-jobs
touch app/api/fetch-jobs/route.ts
```

**Paste this code into `app/api/fetch-jobs/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { fetchAllJobs } from '@/lib/jobApis'
import { saveJobsToDatabase, deleteOldJobs, getJobStats } from '@/lib/jobDatabase'

export async function POST(request: NextRequest) {
  try {
    console.log('[FETCH-JOBS] Starting job fetch...')
    
    const startTime = Date.now()

    // Step 1: Fetch from all APIs
    const allJobs = await fetchAllJobs()
    console.log(`[FETCH-JOBS] Fetched ${allJobs.length} jobs total`)

    // Step 2: Save to database
    const saveResult = await saveJobsToDatabase(allJobs)
    console.log(`[FETCH-JOBS] Database: Added ${saveResult.added}, Skipped ${saveResult.skipped}`)

    // Step 3: Delete old jobs
    const deleted = await deleteOldJobs()
    console.log(`[FETCH-JOBS] Deleted ${deleted} old jobs`)

    // Step 4: Get stats
    const stats = await getJobStats()

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      duration_ms: duration,
      statistics: {
        total_fetched: allJobs.length,
        new_jobs_added: saveResult.added,
        duplicates_skipped: saveResult.skipped,
        old_jobs_deleted: deleted,
        total_jobs_in_db: stats.total,
        by_source: stats.bySource,
      },
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[FETCH-JOBS] Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for easy testing in browser
  return POST(request)
}
```

**What this API does:**
- Called via POST /api/fetch-jobs
- Fetches jobs from all 3 APIs
- Saves new ones to database
- Deletes old ones
- Returns statistics

---

## 5E: Create API Route - Get Jobs for Frontend

Create file: `app/api/jobs/route.ts`

```bash
mkdir -p app/api/jobs
touch app/api/jobs/route.ts
```

**Paste this code into `app/api/jobs/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const title = searchParams.get('title')
    const location = searchParams.get('location')
    const hours = searchParams.get('hours')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const search = searchParams.get('search')

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase.from('jobs').select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,company.ilike.%${search}%`
      )
    }

    if (title && title !== 'All') {
      query = query.ilike('title', `%${title}%`)
    }

    if (location && location !== 'All') {
      query = query.ilike('location', `%${location}%`)
    }

    if (hours) {
      const hoursNum = parseInt(hours)
      const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000).toISOString()
      query = query.gte('posted_at', since)
    }

    // Order by newest first
    query = query.order('posted_at', { ascending: false })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      throw error
    }

    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
      filters: {
        title: title || 'All',
        location: location || 'All',
        hours: hours || 'All',
        search: search || '',
      },
    })

  } catch (error) {
    console.error('[GET-JOBS] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

**What this API does:**
- GET /api/jobs
- Returns filtered jobs based on title, location, hours posted
- Supports pagination
- Supports search

---

## 5F: Test APIs Manually

**Test Fetch API:**
1. Open browser
2. Go to `http://localhost:3000/api/fetch-jobs`
3. You should see JSON response with statistics

**What to expect:**
```json
{
  "success": true,
  "statistics": {
    "total_fetched": 150,
    "new_jobs_added": 145,
    "duplicates_skipped": 5,
    "total_jobs_in_db": 145,
    "by_source": {
      "Remotive": 50,
      "Adzuna": 60,
      "JSearch": 35
    }
  }
}
```

---

---

# STEP 6: FRONTEND - COMPONENTS AND PAGES
## Duration: 120 minutes | Difficulty: ⭐⭐⭐ Hard

### What You'll Do:
Create React components for job display, filters, and search.

---

## 6A: Create Types File

Create file: `types/job.ts`

```bash
mkdir -p types
touch types/job.ts
```

**Paste this code into `types/job.ts`:**

```typescript
export interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary?: string
  description?: string
  source: 'Remotive' | 'Adzuna' | 'JSearch'
  job_url: string
  posted_at: string
}

export interface JobsApiResponse {
  success: boolean
  data: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    title: string
    location: string
    hours: string
    search: string
  }
}
```

---

## 6B: Create Job Card Component

Create file: `components/JobCard.tsx`

```bash
mkdir -p components
touch components/JobCard.tsx
```

**Paste this code into `components/JobCard.tsx`:**

```typescript
'use client'

import { Job } from '@/types/job'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, MapPin, Briefcase } from 'lucide-react'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const postedTime = job.posted_at
    ? formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })
    : 'Unknown'

  const sourceColors: Record<string, string> = {
    Remotive: 'bg-blue-100 text-blue-800',
    Adzuna: 'bg-green-100 text-green-800',
    JSearch: 'bg-purple-100 text-purple-800',
  }

  return (
    <a
      href={job.job_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
    >
      {/* Header with title and source badge */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{job.company}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${sourceColors[job.source] || 'bg-gray-100 text-gray-800'}`}>
          {job.source}
        </span>
      </div>

      {/* Location and Type */}
      <div className="flex gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={16} />
          <span>{job.job_type || 'Not specified'}</span>
        </div>
      </div>

      {/* Salary if available */}
      {job.salary && (
        <div className="text-sm font-medium text-green-700 mb-3">
          {job.salary}
        </div>
      )}

      {/* Time posted */}
      <div className="flex justify-between items-end pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Posted {postedTime}</span>
        <ExternalLink size={16} className="text-gray-400" />
      </div>
    </a>
  )
}
```

**What this component does:**
- Displays one job card
- Shows title, company, location, job type
- Displays which source (Remotive/Adzuna/JSearch)
- Shows time since posted
- Links to original job URL

---

## 6C: Create Filters Component

Create file: `components/Filters.tsx`

```bash
touch components/Filters.tsx
```

**Paste this code into `components/Filters.tsx`:**

```typescript
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void
  isLoading: boolean
}

export interface FilterState {
  title: string
  location: string
  hours: string
  search: string
}

const JOB_TITLES = [
  'All',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
]

const LOCATIONS = [
  'All',
  'Remote',
  'Islamabad',
  'Karachi',
  'Lahore',
  'Peshawar',
  'Quetta',
]

const TIME_FILTERS = [
  { label: 'All Time', value: '' },
  { label: 'Last 1 Hour', value: '1' },
  { label: 'Last 6 Hours', value: '6' },
  { label: 'Last 24 Hours', value: '24' },
]

export default function Filters({ onFilterChange, isLoading }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    title: 'All',
    location: 'All',
    hours: '',
    search: '',
  })

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    const cleared = {
      title: 'All',
      location: 'All',
      hours: '',
      search: '',
    }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs by title, company..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Job Title Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <select
            value={filters.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            {JOB_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posted Within
          </label>
          <select
            value={filters.hours}
            onChange={(e) => handleChange('hours', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            {TIME_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Button */}
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X size={16} />
          Clear All
        </button>
      </div>
    </div>
  )
}
```

**What this component does:**
- Job title dropdown
- Location dropdown
- Time filter dropdown
- Search box
- Clear all button
- Triggers onFilterChange when any filter changes

---

## 6D: Create Jobs Grid Component

Create file: `components/JobsGrid.tsx`

```bash
touch components/JobsGrid.tsx
```

**Paste this code into `components/JobsGrid.tsx`:**

```typescript
'use client'

import { Job } from '@/types/job'
import JobCard from './JobCard'

interface JobsGridProps {
  jobs: Job[]
  isLoading: boolean
  totalJobs: number
}

export default function JobsGrid({ jobs, isLoading, totalJobs }: JobsGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg bg-gray-100 animate-pulse h-32"
          />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-lg">No jobs found matching your filters.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
```

**What this component does:**
- Renders grid of jobs
- Shows loading skeletons
- Shows "no jobs found" message if empty

---

## 6E: Create Main Page Component

Replace content of `app/page.tsx`:

```bash
# This file already exists, just replace it
```

**Paste this code into `app/page.tsx`:**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import Filters, { FilterState } from '@/components/Filters'
import JobsGrid from '@/components/JobsGrid'
import { JobsApiResponse, Job } from '@/types/job'
import { RefreshCw } from 'lucide-react'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [stats, setStats] = useState({ total: 0, bySource: {} as Record<string, number> })
  const [filters, setFilters] = useState<FilterState>({
    title: 'All',
    location: 'All',
    hours: '',
    search: '',
  })

  // Fetch jobs from API
  const fetchJobs = useCallback(async (filterState: FilterState) => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams()
      if (filterState.title !== 'All') params.append('title', filterState.title)
      if (filterState.location !== 'All') params.append('location', filterState.location)
      if (filterState.hours) params.append('hours', filterState.hours)
      if (filterState.search) params.append('search', filterState.search)
      params.append('limit', '15')

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data: JobsApiResponse = await response.json()

      if (data.success) {
        setJobs(data.data)
        setStats(prev => ({
          ...prev,
          total: data.pagination.total,
        }))
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchJobs(filters)
    setLastUpdated(new Date())
  }, [])

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    fetchJobs(newFilters)
  }

  // Manual refresh button
  const handleRefresh = async () => {
    setIsFetching(true)
    try {
      // Call fetch-jobs endpoint
      const response = await fetch('/api/fetch-jobs', { method: 'POST' })
      const result = await response.json()

      if (result.success) {
        // Refetch jobs after update
        await fetchJobs(filters)
        setLastUpdated(new Date())
        alert('Jobs updated! New jobs added: ' + result.statistics.new_jobs_added)
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error)
      alert('Failed to refresh jobs')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 PakJobs Live
              </h1>
              <p className="text-gray-600 mt-1">Pakistan ka real-time job platform</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'Updating...' : 'Update Jobs'}
            </button>
          </div>

          {/* Stats and Last Updated */}
          <div className="mt-4 flex gap-4 flex-wrap text-sm">
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{stats.total}</span> jobs available
            </div>
            {lastUpdated && (
              <div className="text-gray-600">
                Last updated: <span className="font-semibold text-gray-900">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <Filters
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />

        {/* Jobs Grid */}
        <JobsGrid
          jobs={jobs}
          isLoading={isLoading}
          totalJobs={stats.total}
        />

        {/* Source Attribution */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg border border-gray-300 text-center text-sm text-gray-700">
          <p>Jobs aggregated from:</p>
          <div className="mt-2 flex justify-center gap-6 flex-wrap">
            <span className="font-medium">Remotive</span>
            <span className="font-medium">Adzuna</span>
            <span className="font-medium">JSearch</span>
          </div>
        </div>
      </main>
    </div>
  )
}
```

**What this component does:**
- Main dashboard page
- Shows all jobs with filters
- Manual refresh button to update jobs
- Displays stats and last updated time
- Responsive design

---

## 6F: Create Layout File

Replace content of `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PakJobs Live - Pakistan Job Platform',
  description: 'Real-time job aggregator for Pakistan and remote positions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

## 6G: Test Frontend

```bash
npm run dev
```

Go to http://localhost:3000

**You should see:**
- Header with "PakJobs Live" title
- Filter section with dropdowns
- "Update Jobs" button
- Empty state or list of jobs (once you run fetch-jobs manually)

---

---

# STEP 7: CONNECT EVERYTHING - CRON JOBS
## Duration: 30 minutes | Difficulty: ⭐⭐ Medium

### What You'll Do:
Set up automatic job fetching every 2 hours using Vercel Cron.

---

## 7A: Create Vercel Configuration

Create file: `vercel.json` in project root

```bash
touch vercel.json
```

**Paste this into `vercel.json`:**

```json
{
  "crons": [
    {
      "path": "/api/fetch-jobs",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

**What this does:**
- Runs `/api/fetch-jobs` every 2 hours
- `0 */2 * * *` = at minute 0, every 2 hours

---

## 7B: Test Cron Locally (Optional)

The cron won't run on local development, but you can test manually:

```bash
# Terminal 1 (keep running)
npm run dev

# Terminal 2
curl http://localhost:3000/api/fetch-jobs
```

You should see JSON response with job statistics.

---

---

# STEP 8: DEPLOYMENT TO VERCEL
## Duration: 45 minutes | Difficulty: ⭐⭐ Medium

### What You'll Do:
Deploy your app to Vercel (free hosting).

---

## 8A: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial PakJobs Live commit"

# Create repository on github.com and copy the URL
# Then:
git remote add origin https://github.com/YOUR_USERNAME/pakjobs-live.git
git branch -M main
git push -u origin main
```

---

## 8B: Deploy to Vercel

1. **Go to:** https://vercel.com
2. **Sign up:** Use GitHub account
3. **Click:** "Import Project"
4. **Select:** pakjobs-live repository
5. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (default)
   - Environment Variables: Add from .env.local
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`
     - `ADZUNA_APP_ID`
     - `ADZUNA_APP_KEY`
     - `JSEARCH_API_KEY`
     - `JSEARCH_API_HOST`
6. **Click:** "Deploy"

**Wait:** 2-3 minutes

**What you should see:**
- Deployment progress
- "Deployment successful" message
- Live URL (e.g., pakjobs-live-123abc.vercel.app)

---

## 8C: Configure Cron Jobs

After deployment:

1. **Go to:** Vercel dashboard
2. **Select:** Your project
3. **Click:** "Settings"
4. **Find:** "Cron Jobs"
5. **You should see:** The cron job from vercel.json already configured
6. **Status:** Should show "Active"

---

---

# STEP 9: VERIFICATION & TESTING
## Duration: 30 minutes | Difficulty: ⭐ Easy

### What You'll Do:
Test everything end-to-end to make sure it works.

---

## 9A: Test API Keys

**Check Remotive:**
```bash
curl https://remotive.com/api/remote-jobs?limit=5
```
Should return JSON with jobs.

**Check Adzuna:**
```bash
curl "https://api.adzuna.com/v1/api/jobs/pk/search/1?app_id=YOUR_ID&app_key=YOUR_KEY&what=developer&results_per_page=5"
```
Should return JSON with jobs.

**Check JSearch:**
Open https://rapidapi.com and test the endpoint.

---

## 9B: Test Fetch-Jobs Endpoint

Go to live URL and add `/api/fetch-jobs`:
```
https://pakjobs-live-xxx.vercel.app/api/fetch-jobs
```

Should return statistics showing jobs fetched from all 3 sources.

---

## 9C: Test Frontend

1. **Open:** https://pakjobs-live-xxx.vercel.app
2. **Should see:**
   - PakJobs Live header
   - Filter dropdowns
   - "Update Jobs" button
   - Jobs list (after update)
3. **Test filters:**
   - Select "Frontend Developer"
   - Select "Karachi"
   - Select "Last 6 Hours"
   - Jobs should filter instantly
4. **Test search:**
   - Type "React" in search
   - Should show only React-related jobs
5. **Test update:**
   - Click "Update Jobs"
   - Wait 10-15 seconds
   - Should show "Jobs updated" with count

---

## 9D: Check Database

In Supabase dashboard:
1. **Go to:** Table Editor
2. **Click:** "jobs" table
3. Should see rows with jobs
4. Each job should have:
   - title, company, location
   - source (Remotive/Adzuna/JSearch)
   - job_url
   - posted_at timestamp

---

---

# STEP 10: MONITOR & MAINTAIN
## Duration: Ongoing | Difficulty: ⭐ Easy

### What You'll Do:
Keep track of system health and make adjustments.

---

## 10A: Monitor Cron Job

**Check if cron is running:**

In Vercel dashboard:
1. **Go to:** Deployments
2. **Look for:** Cron invocation logs
3. Should see entries every 2 hours

---

## 10B: Monitor Database Usage

**In Supabase dashboard:**
1. **Go to:** Settings → Database → Usage
2. Check:
   - Storage used (should be < 500MB for free tier)
   - Row count in jobs table
   - If approaching limit, upgrade to Pro ($25/month)

---

## 10C: Check API Quotas

| API | Free Limit | Check At |
|---|---|---|
| **Remotive** | Unlimited | No action needed |
| **Adzuna** | 250 requests/day | Calling 2-3x/day = well within limit |
| **JSearch** | 100 requests/month | Calling 15 times/month = well within limit |

---

## 10D: Common Issues & Fixes

### Issue: "No jobs showing"
**Solution:**
1. Check API keys in Vercel env variables
2. Manually trigger `/api/fetch-jobs`
3. Check Supabase table has rows
4. Check browser console for errors (F12)

### Issue: "Database is full"
**Solution:**
1. Upgrade Supabase to Pro ($25/month)
2. Or clear old jobs manually:
   ```sql
   DELETE FROM jobs WHERE posted_at < NOW() - INTERVAL '7 days'
   ```

### Issue: "API calls failing"
**Solution:**
1. Check API credentials in .env.local
2. Test APIs manually (curl commands above)
3. Check API status pages (remotive.com, adzuna.com, rapidapi.com)

---

---

# FINAL CHECKLIST

Before you consider this done:

- [ ] GitHub repo created and synced
- [ ] Vercel deployment successful
- [ ] Supabase account created and table set up
- [ ] All 3 API keys obtained (Remotive, Adzuna, JSearch)
- [ ] Environment variables configured in Vercel
- [ ] Frontend loads at https://your-domain.vercel.app
- [ ] Filters work (title, location, time)
- [ ] Update Jobs button works
- [ ] Jobs appear after clicking Update
- [ ] Jobs from all 3 sources visible (check source badges)
- [ ] Cron running every 2 hours
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

---

---

# WHAT HAPPENS NEXT?

**Day 1-5:** You complete steps 1-8, have a working app live

**Week 2:** 
- Customize colors/branding
- Add email alerts (SendGrid)
- Improve search algorithm

**Week 3:**
- Add saved filters
- Add job history
- Monetize (affiliate links, premium)

**Week 4+:**
- Scale to handle more traffic
- Add more job sources
- International markets

---

# SUPPORT & RESOURCES

**If you get stuck:**

1. **Check error message** - Google the exact error
2. **Read API docs:**
   - Remotive: https://remotive.com/api
   - Adzuna: https://developer.adzuna.com/docs
   - JSearch: https://rapidapi.com/laimoon-laimoon-rest-api/api/jsearch
3. **Supabase docs:** https://supabase.com/docs
4. **Next.js docs:** https://nextjs.org/docs
5. **Vercel docs:** https://vercel.com/docs

---

**Congrats! You now have a complete, free job aggregation platform for Pakistan! 🎉**

Good luck, and feel free to reach out if you need help with any step!

