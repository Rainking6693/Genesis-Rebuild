import { Logger } from './logger';

interface UsageAnalyticsData {
  action: 'sum';
  arguments?: number[];
  result?: number;
  timestamp?: Date;
}

/**
 * Check if the provided Logger instance is available.
 *
 * @param logger Logger instance to be checked
 * @returns True if the Logger instance is available, false otherwise
 */
function isLoggerAvailable(logger: Logger): boolean {
  return typeof logger.info === 'function';
}

/**
 * Function to log usage analytics data.
 *
 * @param data Usage analytics data to be logged
 */
function logUsageAnalytics(data: UsageAnalyticsData): void {
  if (isLoggerAvailable(data.logger)) {
    data.logger.info(data);
  }
}

/**
 * Check if the provided Logger constructor argument is a string.
 *
 * @param logger Logger constructor argument to be checked
 * @returns True if the Logger constructor argument is a string, false otherwise
 */
function isLoggerConstructorArgumentValid(logger: any): boolean {
  return typeof logger === 'string';
}

/**
 * Function to create a new Logger instance.
 *
 * @param name Logger instance name
 * @returns New Logger instance
 */
function createLogger(name: string): Logger {
  if (isLoggerConstructorArgumentValid(name)) {
    return new Logger(name);
  }

  throw new Error('Logger constructor argument must be a string.');
}

/**
 * Function to calculate the sum of two numbers.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param {number} num1 First number
 * @param {number} num2 Second number
 * @returns {number} The sum of the two numbers
 */
function calculateSum(num1: number, num2: number): number {
  if (!isLoggerAvailable(Logger)) {
    throw new Error('Logger instance is not available.');
  }

  try {
    const logger = createLogger('UsageAnalytics');
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }

    const result = num1 + num2;
    logUsageAnalytics({
      action: 'sum',
      arguments: [num1, num2],
      result,
      timestamp: new Date(),
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import { Logger } from './logger';

interface UsageAnalyticsData {
  action: 'sum';
  arguments?: number[];
  result?: number;
  timestamp?: Date;
}

/**
 * Check if the provided Logger instance is available.
 *
 * @param logger Logger instance to be checked
 * @returns True if the Logger instance is available, false otherwise
 */
function isLoggerAvailable(logger: Logger): boolean {
  return typeof logger.info === 'function';
}

/**
 * Function to log usage analytics data.
 *
 * @param data Usage analytics data to be logged
 */
function logUsageAnalytics(data: UsageAnalyticsData): void {
  if (isLoggerAvailable(data.logger)) {
    data.logger.info(data);
  }
}

/**
 * Check if the provided Logger constructor argument is a string.
 *
 * @param logger Logger constructor argument to be checked
 * @returns True if the Logger constructor argument is a string, false otherwise
 */
function isLoggerConstructorArgumentValid(logger: any): boolean {
  return typeof logger === 'string';
}

/**
 * Function to create a new Logger instance.
 *
 * @param name Logger instance name
 * @returns New Logger instance
 */
function createLogger(name: string): Logger {
  if (isLoggerConstructorArgumentValid(name)) {
    return new Logger(name);
  }

  throw new Error('Logger constructor argument must be a string.');
}

/**
 * Function to calculate the sum of two numbers.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param {number} num1 First number
 * @param {number} num2 Second number
 * @returns {number} The sum of the two numbers
 */
function calculateSum(num1: number, num2: number): number {
  if (!isLoggerAvailable(Logger)) {
    throw new Error('Logger instance is not available.');
  }

  try {
    const logger = createLogger('UsageAnalytics');
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }

    const result = num1 + num2;
    logUsageAnalytics({
      action: 'sum',
      arguments: [num1, num2],
      result,
      timestamp: new Date(),
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}