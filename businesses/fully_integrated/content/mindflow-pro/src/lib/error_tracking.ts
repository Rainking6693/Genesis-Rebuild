import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';

interface IErrorInfo {
  message: string;
  stack?: string;
}

interface IErrorData extends IErrorInfo {
  id: string;
  timestamp: string;
  userId: string;
}

interface IErrorTracker {
  logError(error: Error, userId?: string): void;
  getErrors(userId?: string): IErrorData[];
  clearErrors(userId?: string): void;
  hasErrors(userId?: string): boolean;
}

class ErrorTracker implements IErrorTracker {
  private errors: IErrorData[] = [];

  public logError(error: Error, userId?: string): void {
    if (error instanceof Error) {
      const errorData: IErrorData = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: userId || '',
        message: error.message,
        stack: error.stack,
      };

      const encryptedError = encrypt(JSON.stringify(errorData));
      errorData.error = encryptedError;
      this.errors.push(errorData);
    } else {
      console.error(`ErrorTracker: logError received non-Error object: ${JSON.stringify(error)}`);
    }
  }

  public getErrors(userId?: string): IErrorData[] {
    const filteredErrors = this.errors.filter((error) => error.userId === userId || !userId);
    return filteredErrors.map((error) => ({
      ...error,
      error: decrypt(error.error),
    }));
  }

  public clearErrors(userId?: string): void {
    this.errors = this.errors.filter((error) => error.userId !== userId || !userId);
  }

  public hasErrors(userId?: string): boolean {
    return this.errors.some((error) => error.userId === userId || !userId);
  }
}

export { ErrorTracker, IErrorData, IErrorTracker };

import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';

interface IErrorInfo {
  message: string;
  stack?: string;
}

interface IErrorData extends IErrorInfo {
  id: string;
  timestamp: string;
  userId: string;
}

interface IErrorTracker {
  logError(error: Error, userId?: string): void;
  getErrors(userId?: string): IErrorData[];
  clearErrors(userId?: string): void;
  hasErrors(userId?: string): boolean;
}

class ErrorTracker implements IErrorTracker {
  private errors: IErrorData[] = [];

  public logError(error: Error, userId?: string): void {
    if (error instanceof Error) {
      const errorData: IErrorData = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId: userId || '',
        message: error.message,
        stack: error.stack,
      };

      const encryptedError = encrypt(JSON.stringify(errorData));
      errorData.error = encryptedError;
      this.errors.push(errorData);
    } else {
      console.error(`ErrorTracker: logError received non-Error object: ${JSON.stringify(error)}`);
    }
  }

  public getErrors(userId?: string): IErrorData[] {
    const filteredErrors = this.errors.filter((error) => error.userId === userId || !userId);
    return filteredErrors.map((error) => ({
      ...error,
      error: decrypt(error.error),
    }));
  }

  public clearErrors(userId?: string): void {
    this.errors = this.errors.filter((error) => error.userId !== userId || !userId);
  }

  public hasErrors(userId?: string): boolean {
    return this.errors.some((error) => error.userId === userId || !userId);
  }
}

export { ErrorTracker, IErrorData, IErrorTracker };