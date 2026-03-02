const formatLog = (level, message, meta) => {
    const logStruct = {
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        message: message,
        ...(meta && { meta }) // conditionally spread meta if it exists
    };
    // In a real production app, we would use a library like Winston or Pino 
    // to output this to process.stdout. For now, we JSON stringify.
    return JSON.stringify(logStruct);
};

const logger = {
    info: (message, meta) => console.log(formatLog('info', message, meta)),
    error: (message, meta) => console.error(formatLog('error', message, meta)),
    warn: (message, meta) => console.warn(formatLog('warn', message, meta)),
    debug: (message, meta) => console.debug(formatLog('debug', message, meta))
};

module.exports = logger;
