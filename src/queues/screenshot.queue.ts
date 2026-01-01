import { Queue } from 'bullmq'
import {redis} from '../redis.js'

export const screenshotQueue = new Queue('screenshots',{
    connection: redis,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            delay: 5000,
            type: 'fixed'
        },
        removeOnComplete: true,
        removeOnFail: 50
    }
})