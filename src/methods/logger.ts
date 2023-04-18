import type { LoggerCallback } from '../types/logger.js';

let loggerCallback: LoggerCallback | undefined;

export function registerLogger(callback: LoggerCallback): void {
  loggerCallback = callback;
}

export function unregisterLogger(): void {
  loggerCallback = undefined;
}

export function log(message: string): void {
  if (loggerCallback) {
    loggerCallback(message);
  }
}
