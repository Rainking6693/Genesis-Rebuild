import { Logger } from 'winston';

interface ErrorTrackingOptions {
  log: Logger;
}

export class ErrorTracking {
  private logger: Logger;

  constructor(options: ErrorTrackingOptions) {
    this.logger = options.log;
  }

  public trackError(error: Error, context: string, isProduction?: boolean): void {
    this.logError(error, context, isProduction);
  }

  private logError(error: Error, context: string, isProduction?: boolean): void {
    if (!error.message) {
      this.logger.error(`Error occurred in ${context}: Unable to get error message.`);
      return;
    }

    const message = `Error occurred in ${context}: ${error.message}`;
    const stackTrace = error.stack || '';

    if (isProduction) {
      this.logger.error(message);
      this.logger.error(`Stack trace: ${stackTrace}`);
    } else {
      this.logger.warn(message);
      this.logger.warn(`Shortened stack trace: ${stackTrace.slice(0, 50)}`);
    }

    // Add a check for unknown error types
    if (error.constructor.name !== 'Error') {
      this.logger.warn(`Unknown error type: ${error.constructor.name}`);
    }
  }

  private logErrorDetails(error: Error): void {
    this.logger.error(`Stack trace: ${error.stack}`);
  }

  // Add a method to log the error details in case of unhandled rejections
  public handleUnhandledRejection(error: Error): void {
    this.logErrorDetails(error);
  }
}

import { Logger } from 'winston';

interface ErrorTrackingOptions {
  log: Logger;
}

export class ErrorTracking {
  private logger: Logger;

  constructor(options: ErrorTrackingOptions) {
    this.logger = options.log;
  }

  public trackError(error: Error, context: string, isProduction?: boolean): void {
    this.logError(error, context, isProduction);
  }

  private logError(error: Error, context: string, isProduction?: boolean): void {
    if (!error.message) {
      this.logger.error(`Error occurred in ${context}: Unable to get error message.`);
      return;
    }

    const message = `Error occurred in ${context}: ${error.message}`;
    const stackTrace = error.stack || '';

    if (isProduction) {
      this.logger.error(message);
      this.logger.error(`Stack trace: ${stackTrace}`);
    } else {
      this.logger.warn(message);
      this.logger.warn(`Shortened stack trace: ${stackTrace.slice(0, 50)}`);
    }

    // Add a check for unknown error types
    if (error.constructor.name !== 'Error') {
      this.logger.warn(`Unknown error type: ${error.constructor.name}`);
    }
  }

  private logErrorDetails(error: Error): void {
    this.logger.error(`Stack trace: ${error.stack}`);
  }

  // Add a method to log the error details in case of unhandled rejections
  public handleUnhandledRejection(error: Error): void {
    this.logErrorDetails(error);
  }
}