import { config } from "dotenv";
config();
import axios from "axios";

async function main() {
  const apiKey = process.env.RAPIDAPI;
  const apiHost = "jsearch.p.rapidapi.com";
  console.log("JSearch test...");
  try {
    const resp = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: { query: "Jobs in Pakistan", page: 1, num_pages: 1 },
      headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": apiHost },
    });
    const jobs = resp.data.data || [];
    console.log(`Found ${jobs.length} jobs.`);
    if (jobs.length > 0) {
      console.log("First job dates:");
      console.log("job_posted_at_datetime_utc:", jobs[0].job_posted_at_datetime_utc);
      console.log("job_posted_at_timestamp:", jobs[0].job_posted_at_timestamp);
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

main();
