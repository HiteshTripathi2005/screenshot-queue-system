const TARGET_URL = 'http://localhost:3000/screenshot/';
const TEST_URLS = [
    'https://google.com',
    'https://github.com',
    'https://stackoverflow.com',
    'https://reddit.com',
    'https://news.ycombinator.com'
];

const TOTAL_REQUESTS = 500;
const CONCURRENT_REQUESTS = 10;

async function sendRequest(id: number) {
    const url = TEST_URLS[id % TEST_URLS.length];
    const startTime = Date.now();
    try {
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json() as { jobId?: string, error?: string };
        const duration = Date.now() - startTime;

        if (response.ok) {
            console.log(`[Request ${id}] Success: Job ID ${data.jobId} (${duration}ms)`);
            return { success: true, duration };
        } else {
            console.error(`[Request ${id}] Failed: ${data.error} (${duration}ms)`);
            return { success: false, duration };
        }
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`[Request ${id}] Error: ${error.message} (${duration}ms)`);
        return { success: false, duration };
    }
}

async function runStressTest() {
    console.log(`🚀 Starting stress test: ${TOTAL_REQUESTS} total requests, ${CONCURRENT_REQUESTS} concurrent`);
    const startTime = Date.now();
    const results: { success: boolean, duration: number }[] = [];

    for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
        const batch = [];
        for (let j = 0; j < CONCURRENT_REQUESTS && (i + j) < TOTAL_REQUESTS; j++) {
            batch.push(sendRequest(i + j));
        }
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
    }

    const totalTime = Date.now() - startTime;
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    const avgDuration = results.reduce((acc, r) => acc + r.duration, 0) / results.length;

    console.log('\n--- Stress Test Results ---');
    console.log(`Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Average Request Latency: ${avgDuration.toFixed(2)}ms`);
    console.log('---------------------------\n');
    
    console.log('Note: This script only tests the API endpoint. The actual screenshot processing happens in the background workers.');
    console.log('Check the "screenshots/" folder and worker logs to see processing progress.');
}

runStressTest().catch(console.error);
