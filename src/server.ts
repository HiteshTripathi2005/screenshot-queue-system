import Fastify from 'fastify';
import rediesPlugin from './plugins/redies.plugin.js'
import rediesTest from "./routes/redis-routes.js"
import screenshotRoutes from './routes/screenshot-routes.js';

const fastify = Fastify({
  logger: true
});

// Register all plugins and routes
fastify.register(rediesPlugin);
fastify.register(rediesTest, {prefix: '/redis'})
fastify.register(screenshotRoutes, {prefix: '/screenshot'})

// Sample route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});


const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
