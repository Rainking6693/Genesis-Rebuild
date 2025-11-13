import { Logger } from 'winston';

interface ErrorTrackingData {
  timestamp: Date;
  errorMessage: string;
  errorStack: string;
  system: string;
  component: string;
  isProduction: boolean; // Added to differentiate between production and non-production environments
}

export function trackError(error: Error, logger: Logger | undefined, system: string, component: string, isProduction: boolean = false): void {
  if (!logger) {
    console.error('Logger is not defined. Please ensure it is properly initialized.');
    return;
  }

  const errorData: ErrorTrackingData = {
    timestamp: new Date(),
    errorMessage: error.message,
    errorStack: error.stack || '', // Handle cases where error.stack is undefined
    system,
    component,
    isProduction,
  };

  // Log error data to the console in non-production environments
  if (!isProduction) {
    console.error(errorData);
  }

  // Log error data to the Winston logger
  logger.error(errorData);

  // You can also send the error data to a centralized error tracking service here

  // Handle errors when sending error data to the centralized error tracking service
  try {
    // Your error tracking service implementation here
  } catch (e) {
    console.error(`Error while sending error data to the centralized error tracking service: ${e.message}`);
  }
}

// Add a function to send error data to a centralized error tracking service
export async function sendErrorDataToCentralizedService(errorData: ErrorTrackingData): Promise<void> {
  try {
    // Your error tracking service implementation here
  } catch (e) {
    console.error(`Error while sending error data to the centralized error tracking service: ${e.message}`);
  }
}

// Use the sendErrorDataToCentralizedService function in the trackError function
export function trackError(error: Error, logger: Logger | undefined, system: string, component: string, isProduction: boolean = false): void {
  if (!logger) {
    console.error('Logger is not defined. Please ensure it is properly initialized.');
    return;
  }

  const errorData: ErrorTrackingData = {
    timestamp: new Date(),
    errorMessage: error.message,
    errorStack: error.stack || '', // Handle cases where error.stack is undefined
    system,
    component,
    isProduction,
  };

  // Log error data to the console in non-production environments
  if (!isProduction) {
    console.error(errorData);
  }

  // Log error data to the Winston logger
  logger.error(errorData);

  // Send error data to the centralized error tracking service
  sendErrorDataToCentralizedService(errorData);
}

import { Logger } from 'winston';

interface ErrorTrackingData {
  timestamp: Date;
  errorMessage: string;
  errorStack: string;
  system: string;
  component: string;
  isProduction: boolean; // Added to differentiate between production and non-production environments
}

export function trackError(error: Error, logger: Logger | undefined, system: string, component: string, isProduction: boolean = false): void {
  if (!logger) {
    console.error('Logger is not defined. Please ensure it is properly initialized.');
    return;
  }

  const errorData: ErrorTrackingData = {
    timestamp: new Date(),
    errorMessage: error.message,
    errorStack: error.stack || '', // Handle cases where error.stack is undefined
    system,
    component,
    isProduction,
  };

  // Log error data to the console in non-production environments
  if (!isProduction) {
    console.error(errorData);
  }

  // Log error data to the Winston logger
  logger.error(errorData);

  // You can also send the error data to a centralized error tracking service here

  // Handle errors when sending error data to the centralized error tracking service
  try {
    // Your error tracking service implementation here
  } catch (e) {
    console.error(`Error while sending error data to the centralized error tracking service: ${e.message}`);
  }
}

// Add a function to send error data to a centralized error tracking service
export async function sendErrorDataToCentralizedService(errorData: ErrorTrackingData): Promise<void> {
  try {
    // Your error tracking service implementation here
  } catch (e) {
    console.error(`Error while sending error data to the centralized error tracking service: ${e.message}`);
  }
}

// Use the sendErrorDataToCentralizedService function in the trackError function
export function trackError(error: Error, logger: Logger | undefined, system: string, component: string, isProduction: boolean = false): void {
  if (!logger) {
    console.error('Logger is not defined. Please ensure it is properly initialized.');
    return;
  }

  const errorData: ErrorTrackingData = {
    timestamp: new Date(),
    errorMessage: error.message,
    errorStack: error.stack || '', // Handle cases where error.stack is undefined
    system,
    component,
    isProduction,
  };

  // Log error data to the console in non-production environments
  if (!isProduction) {
    console.error(errorData);
  }

  // Log error data to the Winston logger
  logger.error(errorData);

  // Send error data to the centralized error tracking service
  sendErrorDataToCentralizedService(errorData);
}