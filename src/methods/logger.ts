import { LoggerCallback } from '../types/logger.js';

let loggerCallback: LoggerCallback | undefined;

export function registerLogger(callback: LoggerCallback) {
  loggerCallback = callback;
}

export function unregisterLogger() {
  loggerCallback = undefined;
}

export function log(message: string) {
  if (loggerCallback) {
    loggerCallback(message);
  }
}
