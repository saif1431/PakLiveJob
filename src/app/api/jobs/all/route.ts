import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      where: { isActive: true },
      orderBy: { postedAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to load jobs from DB:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}
