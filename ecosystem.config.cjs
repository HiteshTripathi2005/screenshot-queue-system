module.exports = {
  apps: [
    {
      name: 'fastify-server',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      merge_logs: true,
      output: 'logs/server-out.log',
      error: 'logs/server-error.log',
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'screenshots']
    },
    {
      name: 'screenshot-worker',
      script: './dist/worker.js',
      instances: 4,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      merge_logs: true,
      output: 'logs/worker-out.log',
      error: 'logs/worker-error.log',
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'screenshots']
    }
  ]
};
