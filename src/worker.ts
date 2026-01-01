import { Worker, Job } from "bullmq";
import puppeteer, { Browser } from "puppeteer";
import { redis } from "./redis.js";

interface ScreenshotJobData {
  url: string;
}

const worker = new Worker<ScreenshotJobData>(
  "screenshots",
  async (job: Job<ScreenshotJobData>) => {
    const { url } = job.data;
    let browser: Browser | null = null;

    try {
      console.log(`Launching browser for ${url}`);
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      console.log(`📸 Taking screenshot for ${url}`);
      const page = await browser.newPage();

      console.log(`Navigating to ${url}`);
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30_000,
      });

      await page.screenshot({
        path: `screenshots/${job.id}.png`,
        fullPage: true,
      });

      console.log(`✅ Screenshot done for ${url}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
  {
    connection: redis,
    concurrency: 1, // HARD LIMIT
  }
);

worker.on("ready", () => {
  console.log("✅ Worker connected to Redis and ready");
});


worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err.message);
});

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});
