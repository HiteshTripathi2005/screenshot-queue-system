import { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyRequest {
    redis: Redis;
  }
}