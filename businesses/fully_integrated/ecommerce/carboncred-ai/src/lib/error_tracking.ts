import { Logger, NotificationService } from '@carboncred-ai/common';
import { ErrorType, ErrorTrackingParams, SensitiveData } from './error-types';

export interface ExtendedError extends Error {
  stack?: string;
}

export function isError(value: any): value is ExtendedError {
  return value instanceof Error;
}

export function trackError(params: ErrorTrackingParams): void {
  const { error, errorType, sensitiveData } = params;

  // Ensure the error is an instance of Error or its subclass
  if (!isError(error)) {
    throw new Error('The provided error is not an instance of Error or its subclass.');
  }

  // Log the error to the application logs
  Logger.error(`Error type: ${errorType}, Message: ${error.message}`);
  Logger.error(`Stack trace: ${(error as ExtendedError).stack || ''}`);

  // Log sensitive data to a secure storage system (e.g., encrypted database)
  if (sensitiveData) {
    sensitiveData.forEach((data) => {
      Logger.secure(`Sensitive data: ${data}`);
    });
  }

  // Send a notification to the error handling team
  NotificationService.sendErrorNotification(errorType, error.message);
}

// Add a utility function to handle unhandled rejections
import 'regenerator-runtime/runtime';

declare global {
  interface Window {
    handleUnhandledRejection: (reason: any, promise: Promise<any>) => void;
  }
}

if (!('handleUnhandledRejection' in window)) {
  window.handleUnhandledRejection = (reason: any, promise: Promise<any>) => {
    const errorType = ErrorType.UNHANDLED_REJECTION;
    trackError({ error: reason, errorType });
  };

  // Attach the handler to the global promise object
  Promise.prototype.catch = (onRejected) => {
    return this.then(null, onRejected).catch(window.handleUnhandledRejection);
  };
}

// Handle potential edge cases with null or undefined values
export function trackErrorWithEdgeCases(params?: ErrorTrackingParams | null | undefined): void {
  if (!params) return;

  const { error, errorType, sensitiveData } = params;

  if (!error) {
    Logger.error('Error is not provided.');
    return;
  }

  trackError({ error, errorType, sensitiveData });
}

// Add a utility function to handle accessibility
export function isSensitiveData(value: any): value is SensitiveData {
  return Array.isArray(value);
}

// Add a utility function to validate sensitive data
export function validateSensitiveData(sensitiveData: SensitiveData): void {
  if (!sensitiveData.every(isString)) {
    throw new Error('Sensitive data must be an array of strings.');
  }
}

// Add a utility function to check if a value is a string
export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

import { Logger, NotificationService } from '@carboncred-ai/common';
import { ErrorType, ErrorTrackingParams, SensitiveData } from './error-types';

export interface ExtendedError extends Error {
  stack?: string;
}

export function isError(value: any): value is ExtendedError {
  return value instanceof Error;
}

export function trackError(params: ErrorTrackingParams): void {
  const { error, errorType, sensitiveData } = params;

  // Ensure the error is an instance of Error or its subclass
  if (!isError(error)) {
    throw new Error('The provided error is not an instance of Error or its subclass.');
  }

  // Log the error to the application logs
  Logger.error(`Error type: ${errorType}, Message: ${error.message}`);
  Logger.error(`Stack trace: ${(error as ExtendedError).stack || ''}`);

  // Log sensitive data to a secure storage system (e.g., encrypted database)
  if (sensitiveData) {
    sensitiveData.forEach((data) => {
      Logger.secure(`Sensitive data: ${data}`);
    });
  }

  // Send a notification to the error handling team
  NotificationService.sendErrorNotification(errorType, error.message);
}

// Add a utility function to handle unhandled rejections
import 'regenerator-runtime/runtime';

declare global {
  interface Window {
    handleUnhandledRejection: (reason: any, promise: Promise<any>) => void;
  }
}

if (!('handleUnhandledRejection' in window)) {
  window.handleUnhandledRejection = (reason: any, promise: Promise<any>) => {
    const errorType = ErrorType.UNHANDLED_REJECTION;
    trackError({ error: reason, errorType });
  };

  // Attach the handler to the global promise object
  Promise.prototype.catch = (onRejected) => {
    return this.then(null, onRejected).catch(window.handleUnhandledRejection);
  };
}

// Handle potential edge cases with null or undefined values
export function trackErrorWithEdgeCases(params?: ErrorTrackingParams | null | undefined): void {
  if (!params) return;

  const { error, errorType, sensitiveData } = params;

  if (!error) {
    Logger.error('Error is not provided.');
    return;
  }

  trackError({ error, errorType, sensitiveData });
}

// Add a utility function to handle accessibility
export function isSensitiveData(value: any): value is SensitiveData {
  return Array.isArray(value);
}

// Add a utility function to validate sensitive data
export function validateSensitiveData(sensitiveData: SensitiveData): void {
  if (!sensitiveData.every(isString)) {
    throw new Error('Sensitive data must be an array of strings.');
  }
}

// Add a utility function to check if a value is a string
export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}