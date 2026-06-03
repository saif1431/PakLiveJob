// lib/jobApis.ts
import axios from "axios";

export interface ParsedJob {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
  description?: string;
  source: "Remotive" | "Adzuna" | "JSearch";
  sourceJobId?: string;
  jobUrl: string;
  postedAt: Date;
}

// ========== REMOTIVE API ==========
export async function fetchRemotiveJobs(): Promise<ParsedJob[]> {
  try {
    const response = await axios.get("https://remotive.com/api/remote-jobs?limit=50");
    const jobs = response.data.jobs || [];
    const mapped: ParsedJob[] = jobs.map((job: any) => ({
      title: job.title ?? "Unknown",
      company: job.company ?? "Unknown Company",
      location: job.location ?? "Remote",
      jobType: "Remote",
      salary: job.salary ?? undefined,
      description: job.description,
      source: "Remotive",
      sourceJobId: String(job.id),
      jobUrl: job.url ?? "",
      postedAt: new Date(job.publication_date || job.posted_date || 0),
    }));
    const parsed = mapped.filter((j: ParsedJob) => j.jobUrl);
    return parsed;
  } catch (error) {
    console.error("Remotive API error", error);
    return [];
  }
}

// ========== ADZUNA API ==========
export async function fetchAdzunaJobs(): Promise<ParsedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    console.error("Adzuna credentials missing");
    return [];
  }
  const allJobs: ParsedJob[] = [];
  try {
    const response = await axios.get("https://api.adzuna.com/v1/api/jobs/us/search/1", {
      params: {
        app_id: appId,
        app_key: appKey,
        results_per_page: 50,
      },
    });
    const jobs = response.data.results || [];
    const mapped: ParsedJob[] = jobs.map((job: any) => ({
      title: job.title ?? "Unknown",
      company: job.company?.display_name ?? "Unknown Company",
      location: job.location?.display_name ?? "United States",
      jobType: "On-Site",
      salary: job.salary_min ? `${job.salary_min}` : undefined,
      description: job.description,
      source: "Adzuna",
      sourceJobId: String(job.id),
      jobUrl: job.redirect_url ?? "",
      postedAt: new Date(job.created || 0),
    }));
    const parsed = mapped.filter((j: ParsedJob) => j.jobUrl);
    allJobs.push(...parsed);
  } catch (e) {
    console.error(`Adzuna fetch failed:`, e);
  }
  return allJobs;
}

// ========== JSEARCH API ==========
export async function fetchJSearchJobs(): Promise<ParsedJob[]> {
  const apiKey = process.env.JSEARCH_API_KEY || process.env.RAPIDAPI;
  const apiHost = process.env.JSEARCH_API_HOST || "jsearch.p.rapidapi.com";
  if (!apiKey) {
    console.error("JSearch API key missing");
    return [];
  }
  const queries = [
    "Developer",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "AI Engineer"
  ];
  const allJobs: ParsedJob[] = [];
  for (const q of queries) {
    try {
      const resp = await axios.get("https://jsearch.p.rapidapi.com/search", {
        params: { query: q, page: 1, num_pages: 2 },
        headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": apiHost },
      });
      const jobs = resp.data.data || [];
      const parsed: ParsedJob[] = jobs.map((job: any) => ({
        title: job.job_title ?? "Unknown",
        company: job.employer_name ?? "Unknown Company",
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_country ?? "Worldwide"),
        jobType: job.job_is_remote ? "Remote" : "On-Site",
        salary: job.job_min_salary ? `${job.job_min_salary} ${job.job_salary_currency}` : undefined,
        description: job.job_description,
        source: "JSearch",
        sourceJobId: String(job.job_id),
        jobUrl: job.job_apply_link ?? "",
        postedAt: new Date(job.job_posted_at_datetime_utc || job.job_posted_date || 0),
      })).filter((j: ParsedJob) => j.jobUrl);
      allJobs.push(...parsed);
    } catch (e) {
      console.error(`JSearch fetch failed for query ${q}:`, e);
    }
  }
  return allJobs;
}

// ========== COMBINED FETCH ==========
export async function fetchAllJobs(): Promise<ParsedJob[]> {
  const [rem, adz, j] = await Promise.allSettled([
    fetchRemotiveJobs(),
    fetchAdzunaJobs(),
    fetchJSearchJobs(),
  ]);
  const all: ParsedJob[] = [];
  if (rem.status === "fulfilled") all.push(...rem.value);
  if (adz.status === "fulfilled") all.push(...adz.value);
  if (j.status === "fulfilled") all.push(...j.value);
  return all;
}
