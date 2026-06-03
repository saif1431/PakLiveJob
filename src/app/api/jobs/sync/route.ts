import { NextResponse } from 'next/server';
import { fetchAllJobs } from '../../../../../lib/jobApis';
import { upsertJobs } from '../../../../../lib/jobDatabase';

export async function GET() {
  try {
    const jobs = await fetchAllJobs();
    await upsertJobs(jobs);
    return NextResponse.json({ success: true, count: jobs.length });
  } catch (error) {
    console.error("Failed to sync jobs:", error);
    return NextResponse.json({ error: "Failed to sync jobs" }, { status: 500 });
  }
}
