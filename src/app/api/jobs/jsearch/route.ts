import { NextResponse } from 'next/server';
import { fetchJSearchJobs } from '../../../../lib/jobApis';
import { upsertJobs } from '../../.././../../lib/jobDatabase';

export async function GET() {
  const jobs = await fetchJSearchJobs();
  await upsertJobs(jobs);
  return NextResponse.json(jobs);
}
