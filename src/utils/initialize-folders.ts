import path from 'path';
import fs from 'fs';

export function initializeFolders() {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    const logsDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logsDir)){
        fs.mkdirSync(logsDir);
    }
    if (!fs.existsSync(screenshotDir)){
        fs.mkdirSync(screenshotDir);
    }
}