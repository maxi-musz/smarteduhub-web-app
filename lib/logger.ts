/**
 * Server-side logging utility
 * Sends logs to the Next.js API route which logs to terminal
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogData {
  [key: string]: unknown;
}

async function sendLog(level: LogLevel, message: string, data?: LogData) {
  // Disable logging by default - only enable when ENABLE_LOGGING is explicitly "true"
  if (process.env.ENABLE_LOGGING !== "true") {
    return;
  }
  
  try {
    // Send logs to server-side API route which logs to terminal
    await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level,
        message,
        data,
      }),
    }).catch(() => {
      // Silently fail - don't break the app if logging fails
      // This can happen if the API route is not available
    });
  } catch (error: unknown) {
    // Silently fail - don't break the app if logging fails
    // In production, you might want to use a service like Sentry
    console.log("Error logging message:", error);
  }
}

export const logger = {
  info: (message: string, data?: LogData) => sendLog("info", message, data),
  warn: (message: string, data?: LogData) => sendLog("warn", message, data),
  error: (message: string, data?: LogData) => sendLog("error", message, data),
  debug: (message: string, data?: LogData) => sendLog("debug", message, data),
};

