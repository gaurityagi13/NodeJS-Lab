const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Logs folder
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');

// Create logs folder automatically
fs.mkdirSync(LOG_DIR, { recursive: true });

// Logger class
class Logger extends EventEmitter {}

const logger = new Logger();

// Listen for request events
logger.on('request', (method, url) => {

    const line = `${new Date().toISOString()} ${method} ${url}`;

    // Print in terminal
    console.log(line);

    // Save in log file
    fs.appendFile(LOG_FILE, line + '\n', (error) => {
        if (error) {
            logger.emit('error', error);
        }
    });
});

// Prevent logger errors from crashing the server
logger.on('error', (error) => {
    console.error('Logger error:', error.message);
});

// Export logger and log file path
module.exports = {
    logger,
    LOG_FILE
};