import { v4 as uuidv4 } from 'uuid';
import { EncryptedData } from './encryption';

interface ErrorData {
  id: string;
  timestamp: Date;
  errorMessage: string;
  errorType: string;
  userID?: string | null;
  sessionID?: string | null;
}

interface LoggedError extends ErrorData {
  encryptedData: EncryptedData;
}

class ErrorTracker {
  private errors: LoggedError[] = [];

  public logError(errorMessage: string, errorType: string, userID?: string | null, sessionID?: string | null): void {
    if (!userID) userID = '';
    if (!sessionID) sessionID = '';

    const encryptedErrorData = EncryptedData.encrypt(JSON.stringify({ errorMessage, errorType, userID, sessionID }));
    const newError: LoggedError = {
      id: uuidv4(),
      timestamp: new Date(),
      errorMessage: encryptedData.plaintext,
      errorType,
      userID,
      sessionID,
      encryptedData,
    };

    this.errors.push(newError);
  }

  public getErrorCount(): number {
    return this.errors.length;
  }

  public getErrorDetails(errorID: string): ErrorData | null {
    return this.errors.find((error) => error.id === errorID) || null;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getErrorsByUserID(userID: string): ErrorData[] {
    return this.errors.filter((error) => error.userID === userID);
  }

  public getErrorsBySessionID(sessionID: string): ErrorData[] {
    return this.errors.filter((error) => error.sessionID === sessionID);
  }

  public getErrorsByTimeRange(start: Date, end: Date): ErrorData[] {
    return this.errors.filter(
      (error) => error.timestamp >= start && error.timestamp <= end
    );
  }

  // Added a check for valid Date objects
  public getErrorsByTimeRangeWithCheck(start: Date, end: Date): ErrorData[] {
    if (!isDate(start) || !isDate(end)) {
      throw new Error('Both start and end dates must be valid Date objects.');
    }

    return this.errors.filter(
      (error) => error.timestamp >= start && error.timestamp <= end
    );
  }

  // Added a utility function to check if a given value is a Date object
  private isDate(value: any): value is Date {
    return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
  }
}

export { ErrorTracker };

import { v4 as uuidv4 } from 'uuid';
import { EncryptedData } from './encryption';

interface ErrorData {
  id: string;
  timestamp: Date;
  errorMessage: string;
  errorType: string;
  userID?: string | null;
  sessionID?: string | null;
}

interface LoggedError extends ErrorData {
  encryptedData: EncryptedData;
}

class ErrorTracker {
  private errors: LoggedError[] = [];

  public logError(errorMessage: string, errorType: string, userID?: string | null, sessionID?: string | null): void {
    if (!userID) userID = '';
    if (!sessionID) sessionID = '';

    const encryptedErrorData = EncryptedData.encrypt(JSON.stringify({ errorMessage, errorType, userID, sessionID }));
    const newError: LoggedError = {
      id: uuidv4(),
      timestamp: new Date(),
      errorMessage: encryptedData.plaintext,
      errorType,
      userID,
      sessionID,
      encryptedData,
    };

    this.errors.push(newError);
  }

  public getErrorCount(): number {
    return this.errors.length;
  }

  public getErrorDetails(errorID: string): ErrorData | null {
    return this.errors.find((error) => error.id === errorID) || null;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getErrorsByUserID(userID: string): ErrorData[] {
    return this.errors.filter((error) => error.userID === userID);
  }

  public getErrorsBySessionID(sessionID: string): ErrorData[] {
    return this.errors.filter((error) => error.sessionID === sessionID);
  }

  public getErrorsByTimeRange(start: Date, end: Date): ErrorData[] {
    return this.errors.filter(
      (error) => error.timestamp >= start && error.timestamp <= end
    );
  }

  // Added a check for valid Date objects
  public getErrorsByTimeRangeWithCheck(start: Date, end: Date): ErrorData[] {
    if (!isDate(start) || !isDate(end)) {
      throw new Error('Both start and end dates must be valid Date objects.');
    }

    return this.errors.filter(
      (error) => error.timestamp >= start && error.timestamp <= end
    );
  }

  // Added a utility function to check if a given value is a Date object
  private isDate(value: any): value is Date {
    return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
  }
}

export { ErrorTracker };