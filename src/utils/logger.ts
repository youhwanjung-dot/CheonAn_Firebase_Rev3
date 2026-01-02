class ActionLogger {
    static log(action: string, details?: Record<string, unknown>) {
        const timestamp = new Date().toISOString();
        console.log(`[LOG] | ${timestamp} | ${action} |`, details ? JSON.stringify(details) : '');
    }
}

export { ActionLogger };
