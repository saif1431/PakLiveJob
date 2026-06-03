// test-dates.ts
import { config } from "dotenv";
config();
import { fetchRemotiveJobs, fetchAdzunaJobs, fetchJSearchJobs } from "./lib/jobApis";

async function main() {
  console.log("Fetching Remotive...");
  const rem = await fetchRemotiveJobs();
  if (rem.length > 0) {
    console.log("Remotive Date:", rem[0].postedAt);
  }

  console.log("Fetching Adzuna...");
  const adz = await fetchAdzunaJobs();
  if (adz.length > 0) {
    console.log("Adzuna Date:", adz[0].postedAt);
  }

  console.log("Fetching JSearch...");
  const js = await fetchJSearchJobs();
  if (js.length > 0) {
    console.log("JSearch Date:", js[0].postedAt);
  }
}

main().catch(console.error);
