import { NextResponse } from 'next/server';
import { fetchAdzunaJobs } from '../../.././../../lib/jobApis';
import { upsertJobs } from '../../.././../../lib/jobDatabase';

export async function GET() {
  const jobs = await fetchAdzunaJobs();
  await upsertJobs(jobs);
  return NextResponse.json(jobs);
}
