import { ErrorTracker } from 'secure-error-tracking-library';

type Options = {
  apiKey: string;
  environment: string;
};

type Context = string | undefined;

class MoodSyncErrorTracker {
  private tracker: ErrorTracker;

  constructor(options: Options) {
    this.validateOptions(options);

    this.tracker = new ErrorTracker({
      apiKey: this.getEnvVar('MOODSYNC_ERROR_TRACKING_API_KEY', options.apiKey),
      environment: this.getEnvVar('NODE_ENV', options.environment),
    });
  }

  private validateOptions(options: Options): void {
    if (!options.apiKey || !options.environment) {
      throw new Error('Missing required options: apiKey and environment');
    }
  }

  private validateContext(context: Context): void {
    if (typeof context !== 'string') {
      throw new Error('Context must be a string');
    }
  }

  private validateError(error: Error): void {
    if (!error instanceof Error) {
      throw new Error('Error must be an instance of Error');
    }
  }

  private validateException(exception: Error): void {
    if (!exception instanceof Error) {
      throw new Error('Exception must be an instance of Error');
    }
  }

  private getEnvVar(envVarName: string, defaultValue: string): string {
    const value = process.env[envVarName];
    return value || defaultValue;
  }

  public logError(error: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateError(error);
    this.tracker.logError(error, context);
  }

  public logException(exception: Error): void {
    this.validateException(exception);
    this.tracker.logException(exception);
  }

  public logErrorWithContext(error: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateError(error);
    this.tracker.logError(error, context);
  }

  public logExceptionWithContext(exception: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateException(exception);
    this.tracker.logException(exception);
  }

  // Added a check for null or undefined tracker
  public isInitialized(): boolean {
    return !!this.tracker;
  }

  // Added a method to initialize the tracker if it's not already initialized
  public initialize(options: Options): void {
    if (!this.isInitialized()) {
      this.constructor(options);
    }
  }
}

export function trackErrors(options?: Options): MoodSyncErrorTracker {
  let errorTracker: MoodSyncErrorTracker | null = null;

  function createErrorTracker(options: Options): MoodSyncErrorTracker {
    return new MoodSyncErrorTracker(options);
  }

  if (!errorTracker) {
    errorTracker = createErrorTracker({});
  }

  return errorTracker;
}

import { trackErrors } from './error_tracking';

const errorTracker = trackErrors();

// ... elsewhere in your code
try {
  // Some potentially error-prone code
} catch (error) {
  if (errorTracker && errorTracker.isInitialized()) {
    errorTracker.logErrorWithContext(error, 'SomeComponent');
  }
}

import { ErrorTracker } from 'secure-error-tracking-library';

type Options = {
  apiKey: string;
  environment: string;
};

type Context = string | undefined;

class MoodSyncErrorTracker {
  private tracker: ErrorTracker;

  constructor(options: Options) {
    this.validateOptions(options);

    this.tracker = new ErrorTracker({
      apiKey: this.getEnvVar('MOODSYNC_ERROR_TRACKING_API_KEY', options.apiKey),
      environment: this.getEnvVar('NODE_ENV', options.environment),
    });
  }

  private validateOptions(options: Options): void {
    if (!options.apiKey || !options.environment) {
      throw new Error('Missing required options: apiKey and environment');
    }
  }

  private validateContext(context: Context): void {
    if (typeof context !== 'string') {
      throw new Error('Context must be a string');
    }
  }

  private validateError(error: Error): void {
    if (!error instanceof Error) {
      throw new Error('Error must be an instance of Error');
    }
  }

  private validateException(exception: Error): void {
    if (!exception instanceof Error) {
      throw new Error('Exception must be an instance of Error');
    }
  }

  private getEnvVar(envVarName: string, defaultValue: string): string {
    const value = process.env[envVarName];
    return value || defaultValue;
  }

  public logError(error: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateError(error);
    this.tracker.logError(error, context);
  }

  public logException(exception: Error): void {
    this.validateException(exception);
    this.tracker.logException(exception);
  }

  public logErrorWithContext(error: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateError(error);
    this.tracker.logError(error, context);
  }

  public logExceptionWithContext(exception: Error, context: Context = 'Unknown'): void {
    this.validateContext(context);
    this.validateException(exception);
    this.tracker.logException(exception);
  }

  // Added a check for null or undefined tracker
  public isInitialized(): boolean {
    return !!this.tracker;
  }

  // Added a method to initialize the tracker if it's not already initialized
  public initialize(options: Options): void {
    if (!this.isInitialized()) {
      this.constructor(options);
    }
  }
}

export function trackErrors(options?: Options): MoodSyncErrorTracker {
  let errorTracker: MoodSyncErrorTracker | null = null;

  function createErrorTracker(options: Options): MoodSyncErrorTracker {
    return new MoodSyncErrorTracker(options);
  }

  if (!errorTracker) {
    errorTracker = createErrorTracker({});
  }

  return errorTracker;
}

import { trackErrors } from './error_tracking';

const errorTracker = trackErrors();

// ... elsewhere in your code
try {
  // Some potentially error-prone code
} catch (error) {
  if (errorTracker && errorTracker.isInitialized()) {
    errorTracker.logErrorWithContext(error, 'SomeComponent');
  }
}