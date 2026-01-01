import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    const allKeys = await request.redis.keys("*");
    return { keys: allKeys };
  });
  
    fastify.get("/redis-clean", async (request, reply) => {
    const allKeys = await request.redis.keys("*");
    for (const key of allKeys) {
      await request.redis.del(key);
    }
    return { message: "All keys deleted" };
  });

  fastify.get("/redis-test", async (request, reply) => {
    await request.redis.set("ping", "pong");
    const value = await request.redis.get("ping");
    return { value };
  });
}
