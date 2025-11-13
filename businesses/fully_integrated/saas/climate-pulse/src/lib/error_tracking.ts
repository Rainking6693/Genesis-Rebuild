import { Logger, format, transports } from 'winston';
import { IError, IErrorTracking } from './error.interface';

export interface IErrorTracking {
  logError(error: IError): void;
  logErrorWithContext(error: IError, context: string): void;
}

export class ErrorTracking implements IErrorTracking {
  private logger: Logger;
  private errorTransport: transports.Console;

  constructor(logger: Logger) {
    this.logger = logger;
    this.errorTransport = new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.label({ label: 'Error Tracking' }),
        format.errors({ stack: true }),
      ),
    });
    this.logger.add(this.errorTransport);
  }

  logError(error: IError): void {
    this.logger.error(
      {
        errorMessage: error.message,
        errorStack: error.stack,
        errorTimestamp: new Date().toISOString(),
      },
    );
  }

  logErrorWithContext(error: IError, context: string): void {
    this.errorTransport.log({
      level: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
      context,
      metaData: {
        errorStack: error.stack,
      },
    });
  }

  // Add a method to handle unhandled exceptions
  setupUnhandledExceptionHandler(): void {
    process.on('unhandledRejection', (error: any) => {
      this.logError({
        message: error.message,
        stack: error.stack,
      });
    });
  }
}

import { Logger, format, transports } from 'winston';
import { IError, IErrorTracking } from './error.interface';

export interface IErrorTracking {
  logError(error: IError): void;
  logErrorWithContext(error: IError, context: string): void;
}

export class ErrorTracking implements IErrorTracking {
  private logger: Logger;
  private errorTransport: transports.Console;

  constructor(logger: Logger) {
    this.logger = logger;
    this.errorTransport = new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.label({ label: 'Error Tracking' }),
        format.errors({ stack: true }),
      ),
    });
    this.logger.add(this.errorTransport);
  }

  logError(error: IError): void {
    this.logger.error(
      {
        errorMessage: error.message,
        errorStack: error.stack,
        errorTimestamp: new Date().toISOString(),
      },
    );
  }

  logErrorWithContext(error: IError, context: string): void {
    this.errorTransport.log({
      level: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
      context,
      metaData: {
        errorStack: error.stack,
      },
    });
  }

  // Add a method to handle unhandled exceptions
  setupUnhandledExceptionHandler(): void {
    process.on('unhandledRejection', (error: any) => {
      this.logError({
        message: error.message,
        stack: error.stack,
      });
    });
  }
}