import { ErrorTracker } from './error_tracker';

interface CustomError extends Error {
  num1?: number;
  num2?: number;
  timestamp?: Date;
}

class ErrorTracker {
  private errors: CustomError[] = [];

  constructor(private readonly appName: string) {}

  logError(message: string, error: CustomError) {
    error.timestamp = new Date();
    this.errors.push(error);
    console.error(`${this.appName}: ${message}: ${JSON.stringify(error)}`);
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

const errorTracker = new ErrorTracker('MyApp');

function addNumbers(num1: number, num2: number): number {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    const customError: CustomError = new Error('Both num1 and num2 should be numbers.');
    customError.num1 = num1;
    customError.num2 = num2;
    errorTracker.logError('Invalid input', customError);
    throw customError;
  }

  return num1 + num2;
}

import { ErrorTracker } from './error_tracker';

interface CustomError extends Error {
  num1?: number;
  num2?: number;
  timestamp?: Date;
}

class ErrorTracker {
  private errors: CustomError[] = [];

  constructor(private readonly appName: string) {}

  logError(message: string, error: CustomError) {
    error.timestamp = new Date();
    this.errors.push(error);
    console.error(`${this.appName}: ${message}: ${JSON.stringify(error)}`);
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

const errorTracker = new ErrorTracker('MyApp');

function addNumbers(num1: number, num2: number): number {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    const customError: CustomError = new Error('Both num1 and num2 should be numbers.');
    customError.num1 = num1;
    customError.num2 = num2;
    errorTracker.logError('Invalid input', customError);
    throw customError;
  }

  return num1 + num2;
}