import db from '@/lib/db';
import { ParsedJob } from '@/lib/jobApis';

/**
 * Upserts an array of ParsedJob objects into the `Job` table.
 * Uses `sourceJobId` as a unique identifier when available; otherwise falls back to a composite key.
 */
export async function upsertJobs(jobs: ParsedJob[]) {
  const ops = jobs.map(job =>
    db.job.upsert({
      where: { sourceJobId: job.sourceJobId ?? '' },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        salary: job.salary,
        description: job.description,
        source: job.source,
        jobUrl: job.jobUrl,
        postedAt: job.postedAt,
        fetchedAt: new Date(),
        isActive: true,
      },
      create: {
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        salary: job.salary,
        description: job.description,
        source: job.source,
        sourceJobId: job.sourceJobId ?? '',
        jobUrl: job.jobUrl,
        postedAt: job.postedAt,
      },
    })
  );
  await Promise.all(ops);
}
