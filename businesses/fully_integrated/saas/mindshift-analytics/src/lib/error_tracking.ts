import { ErrorLogger } from './error-logging-service';

export interface ErrorTrackingOptions {
  // Customize the maximum number of errors to store in memory before flushing to the logger.
  maxErrorsInMemory?: number;

  // Customize the interval (in milliseconds) at which errors are flushed to the logger.
  flushInterval?: number;
}

export interface ErrorTrackingInstance {
  trackError(error: Error, context: string): void;
  logErrorWithContext(error: Error, context: string): void;
  getErrorCount(): number;
  clearErrors(): void;
  flushErrors(): void;
  stopFlushingErrors(): void;
  startFlushingErrors(callback?: () => void): void;
  hasFlushInterval(): boolean;
  getFlushInterval(): number | null;
}

export class ErrorTracking implements ErrorTrackingInstance {
  private static instance: ErrorTracking;
  private logger: ErrorLogger;
  private errorsInMemory: Error[] = [];
  private maxErrorsInMemory: number;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor(options?: ErrorTrackingOptions) {
    this.maxErrorsInMemory = options?.maxErrorsInMemory || 100;
    this.flushInterval = options?.flushInterval || 60000;

    this.logger = ErrorLogger.initialize();

    this.startFlushingErrors();
  }

  public static getInstance(options?: ErrorTrackingOptions): ErrorTracking {
    if (!ErrorTracking.instance) {
      ErrorTracking.instance = new ErrorTracking(options);
    }

    return ErrorTracking.instance;
  }

  public trackError(error: Error, context: string): void {
    this.errorsInMemory.push({ error, context });

    if (this.errorsInMemory.length > this.maxErrorsInMemory) {
      this.flushErrors();
    }
  }

  public logErrorWithContext(error: Error, context: string): void {
    this.logger.logError(error, context);
    this.trackError(error, context);
  }

  public getErrorCount(): number {
    return this.errorsInMemory.length;
  }

  public clearErrors(): void {
    this.errorsInMemory.length = 0;
  }

  public flushErrors(): void {
    if (this.errorsInMemory.length > 0) {
      this.errorsInMemory.forEach(({ error, context }) => {
        this.logger.logError(error, context);
      });

      this.errorsInMemory.length = 0;
    }
  }

  public stopFlushingErrors(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  public startFlushingErrors(callback?: () => void): void {
    this.stopFlushingErrors();
    this.flushErrors();
    this.flushInterval = setInterval(() => {
      this.flushErrors();
      if (callback) callback();
    }, this.flushInterval);
  }

  public hasFlushInterval(): boolean {
    return this.flushInterval !== null;
  }

  public getFlushInterval(): number | null {
    return this.flushInterval;
  }
}

import { ErrorTracking } from './error-tracking';

const errorTracker = ErrorTracking.getInstance();

errorTracker.trackError(new Error('An error occurred'), 'Component A');

import { ErrorLogger } from './error-logging-service';

// ...

export class ErrorLogger {
  // ...

  public static initialize(): ErrorLogger {
    // ...
    return new ErrorLogger();
  }

  // ...
}

import { ErrorLogger } from './error-logging-service';

export interface ErrorTrackingOptions {
  // Customize the maximum number of errors to store in memory before flushing to the logger.
  maxErrorsInMemory?: number;

  // Customize the interval (in milliseconds) at which errors are flushed to the logger.
  flushInterval?: number;
}

export interface ErrorTrackingInstance {
  trackError(error: Error, context: string): void;
  logErrorWithContext(error: Error, context: string): void;
  getErrorCount(): number;
  clearErrors(): void;
  flushErrors(): void;
  stopFlushingErrors(): void;
  startFlushingErrors(callback?: () => void): void;
  hasFlushInterval(): boolean;
  getFlushInterval(): number | null;
}

export class ErrorTracking implements ErrorTrackingInstance {
  private static instance: ErrorTracking;
  private logger: ErrorLogger;
  private errorsInMemory: Error[] = [];
  private maxErrorsInMemory: number;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor(options?: ErrorTrackingOptions) {
    this.maxErrorsInMemory = options?.maxErrorsInMemory || 100;
    this.flushInterval = options?.flushInterval || 60000;

    this.logger = ErrorLogger.initialize();

    this.startFlushingErrors();
  }

  public static getInstance(options?: ErrorTrackingOptions): ErrorTracking {
    if (!ErrorTracking.instance) {
      ErrorTracking.instance = new ErrorTracking(options);
    }

    return ErrorTracking.instance;
  }

  public trackError(error: Error, context: string): void {
    this.errorsInMemory.push({ error, context });

    if (this.errorsInMemory.length > this.maxErrorsInMemory) {
      this.flushErrors();
    }
  }

  public logErrorWithContext(error: Error, context: string): void {
    this.logger.logError(error, context);
    this.trackError(error, context);
  }

  public getErrorCount(): number {
    return this.errorsInMemory.length;
  }

  public clearErrors(): void {
    this.errorsInMemory.length = 0;
  }

  public flushErrors(): void {
    if (this.errorsInMemory.length > 0) {
      this.errorsInMemory.forEach(({ error, context }) => {
        this.logger.logError(error, context);
      });

      this.errorsInMemory.length = 0;
    }
  }

  public stopFlushingErrors(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  public startFlushingErrors(callback?: () => void): void {
    this.stopFlushingErrors();
    this.flushErrors();
    this.flushInterval = setInterval(() => {
      this.flushErrors();
      if (callback) callback();
    }, this.flushInterval);
  }

  public hasFlushInterval(): boolean {
    return this.flushInterval !== null;
  }

  public getFlushInterval(): number | null {
    return this.flushInterval;
  }
}

import { ErrorTracking } from './error-tracking';

const errorTracker = ErrorTracking.getInstance();

errorTracker.trackError(new Error('An error occurred'), 'Component A');

import { ErrorLogger } from './error-logging-service';

// ...

export class ErrorLogger {
  // ...

  public static initialize(): ErrorLogger {
    // ...
    return new ErrorLogger();
  }

  // ...
}