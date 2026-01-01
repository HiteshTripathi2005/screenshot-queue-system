# Screenshot Queue System

A high-performance, distributed screenshot capture service built with Fastify, BullMQ, and Puppeteer. This system efficiently processes screenshot requests using a job queue architecture with Redis and horizontal scaling capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Performance](#-performance)
- [Project Structure](#-project-structure)

## ✨ Features

- **Asynchronous Job Processing**: Handle screenshot requests without blocking the API server
- **Job Queue System**: Built on BullMQ for reliable job management and persistence
- **Redis Integration**: Leverages Redis for caching, session management, and queue storage
- **Distributed Workers**: Multiple worker processes for concurrent screenshot processing
- **Puppeteer Integration**: Full-page screenshot capture with configurable wait conditions
- **Stress Testing**: Built-in load testing suite to validate system performance
- **PM2 Process Management**: Automatic process management, monitoring, and restart capabilities
- **Development & Production Modes**: Environment-specific configurations for optimal performance
- **Error Handling**: Comprehensive error handling with detailed logging

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: [Fastify](https://www.fastify.io/) - High-performance HTTP server
- **Task Queue**: [BullMQ](https://bullmq.io/) - Redis-based job queue
- **Browser Automation**: [Puppeteer](https://pptr.dev/) - Headless Chrome/Chromium control
- **Cache & Message Broker**: [Redis](https://redis.io/)
- **Process Manager**: [PM2](https://pm2.keymetrics.io/)
- **Build Tool**: TypeScript with [tsx](https://tsx.is/)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          Fastify HTTP Server (Port 3000)        │
│                                                 │
│  POST /screenshot/ → Add job to BullMQ Queue   │
│  GET  /redis/*    → Redis operations           │
└─────────────────────────────────────────────────┘
              ↓
         Redis Queue
              ↓
┌─────────────────────────────────────────────────┐
│    BullMQ Workers (4 instances, Concurrency: 1)│
│                                                 │
│  Each worker:                                   │
│  - Launches Puppeteer browser instance         │
│  - Navigates to URL                            │
│  - Captures full-page screenshot               │
│  - Saves to /screenshots directory             │
└─────────────────────────────────────────────────┘
```

## 📦 Prerequisites

- Node.js 18+ (recommended: latest LTS)
- Redis Server (local or remote)
- Unix/Linux environment (for production with PM2)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd learning
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Ensure Redis is Running

```bash
# On macOS with Homebrew
brew services start redis

# On Ubuntu/Debian
sudo systemctl start redis-server

# With Docker
docker run -d -p 6379:6379 redis:latest
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory (optional for local development):

```env
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
FASTIFY_PORT=3000
FASTIFY_HOST=0.0.0.0
```

### PM2 Configuration

Edit `ecosystem.config.cjs` to customize:

- **Worker Instances**: Adjust `instances` count in the `screenshot-worker` configuration
- **Memory Limits**: Modify `max_memory_restart` for resource constraints
- **Logging**: Change `output` and `error` log file paths
- **Watch Mode**: Enable/disable file watching

## 📚 Usage

### Development Mode

Start the server with hot-reload enabled:

```bash
npm run dev
```

This runs the Fastify server at `http://localhost:3000`.

In another terminal, start the worker:

```bash
npm run build
npm run worker
```

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

Output files are generated in the `dist/` directory.

### Production with PM2

Start the application with PM2 process manager:

```bash
# Development environment
npm run pm2:start

# Production environment
npm run pm2:start:prod
```

### PM2 Management Commands

```bash
npm run pm2:status      # View all running processes
npm run pm2:logs        # View real-time logs
npm run pm2:restart     # Restart all processes
npm run pm2:stop        # Stop all processes
npm run pm2:delete      # Delete all PM2 processes
npm run pm2:flush       # Clear PM2 log files
```

## 🔌 API Endpoints

### Screenshot Service

#### Add Screenshot Job
```http
POST /screenshot/
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response** (201 Created):
```json
{
  "jobId": "job_12345",
  "message": "Screenshot job added successfully"
}
```

**Response** (500 Error):
```json
{
  "error": "Failed to add screenshot job"
}
```

### Redis Management

#### List All Redis Keys
```http
GET /redis/
```

**Response**:
```json
{
  "keys": ["bull:screenshots:1", "bull:screenshots:2", ...]
}
```

#### Test Redis Connection
```http
GET /redis/redis-test
```

**Response**:
```json
{
  "value": "pong"
}
```

#### Clean All Redis Keys
```http
GET /redis/redis-clean
```

**Response**:
```json
{
  "message": "All keys deleted"
}
```

### Health Check

```http
GET /
```

**Response**:
```json
{
  "hello": "world"
}
```

## 💻 Development

### Project Structure

```
.
├── src/
│   ├── server.ts              # Fastify HTTP server entry point
│   ├── worker.ts              # BullMQ worker for processing jobs
│   ├── redis.ts               # Redis client configuration
│   ├── types.d.ts             # TypeScript type definitions
│   ├── plugins/
│   │   └── redies.plugin.ts    # Redis integration plugin
│   ├── queues/
│   │   └── screenshot.queue.ts # BullMQ queue configuration
│   └── routes/
│       ├── screenshot-routes.ts # Screenshot job endpoints
│       └── redis-routes.ts      # Redis management endpoints
├── dist/                       # Compiled JavaScript output
├── logs/                       # Application logs
├── screenshots/               # Generated screenshots
├── stress-test.ts            # Load testing script
├── ecosystem.config.cjs       # PM2 configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

### Running Tests

Execute the stress test to validate system performance:

```bash
npm run test:stress
```

The stress test will:
- Send 500 concurrent requests (in batches of 10)
- Test against 5 different URLs
- Measure response times
- Report success/failure rates

## 📊 Performance

### Stress Test Metrics

The built-in stress test (`stress-test.ts`) sends:
- **Total Requests**: 500
- **Concurrent Requests**: 10 (batches)
- **Test URLs**: Google, GitHub, Stack Overflow, Reddit, Hacker News

### Optimization Tips

1. **Worker Concurrency**: Adjust `concurrency` in `worker.ts` based on system resources
2. **Puppeteer Arguments**: Tune browser arguments for your environment
3. **Memory Management**: Monitor and adjust `max_memory_restart` in PM2 config
4. **Network Timeouts**: Customize page load timeout (currently 30s) in `worker.ts`
5. **Browser Sandbox**: The config disables sandbox mode (`--no-sandbox`) for Docker compatibility

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Build the project: `npm run build`
- [ ] Test locally: `npm run test:stress`
- [ ] Verify Redis connectivity
- [ ] Create logs directory: `mkdir -p logs`
- [ ] Ensure Node.js 18+ is installed
- [ ] Configure PM2 ecosystem settings

### Deployment Steps

```bash
# 1. Build the project
npm run build

# 2. Start with PM2 in production mode
npm run pm2:start:prod

# 3. Verify processes are running
npm run pm2:status

# 4. Monitor logs
npm run pm2:logs
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 🔧 Troubleshooting

### Redis Connection Failed
- Verify Redis is running: `redis-cli ping`
- Check Redis host and port configuration
- Ensure network connectivity

### Screenshots Not Saved
- Verify `/screenshots` directory exists with write permissions
- Check worker logs: `npm run pm2:logs`
- Ensure Puppeteer has sufficient disk space

### High Memory Usage
- Reduce worker `instances` in `ecosystem.config.cjs`
- Lower the number of concurrent jobs
- Adjust `max_memory_restart` threshold

### Jobs Stuck in Queue
- Clear queue: `GET /redis/redis-clean`
- Restart workers: `npm run pm2:restart`
- Check worker error logs

## 📄 License

ISC

## 👤 Author

Hitesh Tripathi

---

**Last Updated**: January 2026
