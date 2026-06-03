"use client";

import React from "react";
import { Job } from "./JobCard";
import JobCard from "./JobCard";

interface JobListClientProps {
  searchTerm: string;
  locationFilter: string;
  roleFilter: string;
  onNewJobs?: (count: number) => void;
  refreshKey?: number;
}

const LoadingSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <section>
      <div className="h-6 bg-zinc-200 rounded w-32 mb-6"></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[220px] bg-zinc-50 rounded-2xl border border-zinc-100 p-6 flex flex-col gap-4">
             <div className="h-6 bg-zinc-200 rounded w-3/4"></div>
             <div className="h-4 bg-zinc-200 rounded w-1/2 mt-1"></div>
             <div className="flex gap-2 mt-2">
               <div className="h-6 bg-zinc-200 rounded-full w-20"></div>
               <div className="h-6 bg-zinc-200 rounded-full w-24"></div>
             </div>
             <div className="h-10 bg-zinc-200 rounded-xl mt-auto"></div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const JobListClient: React.FC<JobListClientProps> = ({
  searchTerm,
  locationFilter,
  roleFilter,
  onNewJobs,
  refreshKey,
}) => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const addJobs = (newJobs: Job[]) => {
    setJobs((prev) => {
      const combined = [...prev, ...newJobs];
      const unique: Job[] = [];
      const seen = new Set();
      for (const job of combined) {
        const key = job.sourceJobId || job.jobUrl;
        if (key && !seen.has(key)) {
          seen.add(key);
          unique.push(job);
        } else if (!key) {
          unique.push(job);
        }
      }
      return unique.sort((a, b) => {
        if (!a.postedAt) return 1;
        if (!b.postedAt) return -1;
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
    });
  };

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Load fast from DB first
        const res = await fetch("/api/jobs/all");
        if (res.ok) {
          const dbJobs = await res.json();
          addJobs(dbJobs);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }

      // Live fetch progressively
      setSyncing(true);
      const endpoints = ["/api/jobs/remotive", "/api/jobs/adzuna", "/api/jobs/jsearch"];
      let completed = 0;

      const promises = endpoints.map(async (ep) => {
        try {
          const res = await fetch(ep);
          if (res.ok) {
            const liveJobs = await res.json();
            addJobs(liveJobs);
          }
        } catch (e) {
          console.error(`Error fetching ${ep}`, e);
        } finally {
          completed++;
          setSyncProgress(Math.round((completed / endpoints.length) * 100));
        }
      });

      await Promise.allSettled(promises);
      setSyncing(false);
    };
    
    fetchJobs();
  }, [refreshKey]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));

    const matchesRole =
      !roleFilter ||
      (job.title && job.title.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesLocation && matchesRole;
  });

  if (loading) {
    return <LoadingSkeleton />;
  }
  
  if (error && jobs.length === 0) {
    return <div className="text-center py-8 text-red-600">Error loading jobs: {error}</div>;
  }

  // Split into "Latest" (last 24h) and "All" jobs
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const latestJobs = filteredJobs.filter((job) => job.postedAt && new Date(job.postedAt) > oneDayAgo);
  const otherJobs = filteredJobs.filter((job) => !job.postedAt || new Date(job.postedAt) <= oneDayAgo);

  return (
    <div className="space-y-10 relative">
      {/* Top progress bar */}
      {syncing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-100 z-50">
          <div
            className="h-full bg-[#2b7fff] transition-all duration-500 ease-out"
            style={{ width: `${syncProgress}%` }}
          />
        </div>
      )}

      {/* Sync Status Banner */}
      {syncing && (
        <div className="flex justify-between items-center bg-blue-50/80 backdrop-blur-sm text-[#2b7fff] px-4 py-3 rounded-xl mb-8 border border-blue-100 shadow-sm text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Finding live jobs across multiple platforms...
          </span>
          <span className="bg-blue-100 text-[#2b7fff] px-2 py-0.5 rounded-md">{syncProgress}%</span>
        </div>
      )}

      {filteredJobs.length === 0 && !syncing ? (
        <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">No jobs found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {latestJobs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-[#2b7fff] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">New</span>
                Latest Jobs
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestJobs.map((job) => (
                  <JobCard key={job.id ?? job.jobUrl} job={job} />
                ))}
              </div>
            </section>
          )}

          {otherJobs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-200 pb-2">
                {latestJobs.length > 0 ? "Other Jobs" : "All Jobs"}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherJobs.map((job) => (
                  <JobCard key={job.id ?? job.jobUrl} job={job} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default JobListClient;
