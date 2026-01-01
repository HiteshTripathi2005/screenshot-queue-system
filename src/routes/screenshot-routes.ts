import { FastifyInstance } from "fastify";
import { screenshotQueue } from "../queues/screenshot.queue.js";


export default async function (fastify: FastifyInstance) {
    fastify.post("/", async (request, reply) => {
        try {
            const {url} = request.body as {url: string};
            new URL(url)
            const job = await screenshotQueue.add('screenshot-job', { url });
            return { jobId: job.id, message: "Screenshot job added successfully" };
        } catch (error) {
            console.error("Error adding screenshot job:", error);
            return reply.status(500).send({ error: "Failed to add screenshot job" });
        }
    });
}