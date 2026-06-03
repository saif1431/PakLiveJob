import { NextResponse } from 'next/server';
import { fetchRemotiveJobs } from '../../../../lib/jobApis';
import { upsertJobs } from '../../.././../../lib/jobDatabase';

export async function GET() {
  const jobs = await fetchRemotiveJobs();
  await upsertJobs(jobs);
  return NextResponse.json(jobs);
}
