import { IReportingEngine, ReportingEngineOptions, IEmployeeWellnessData, IWellnessContent } from './interfaces';
import { encrypt, decrypt } from '../security/encryption';
import { validate, isUndefined } from '../utils';
import { CustomError } from './custom-error';

class ReportingEngine implements IReportingEngine {
  private options: ReportingEngineOptions;

  constructor(options: ReportingEngineOptions) {
    this.options = {
      ...options,
      encryptionKey: validate.isString(options.encryptionKey) ? options.encryptionKey : 'default_encryption_key',
      reportCallback: validate.isFunction(options.reportCallback) ? options.reportCallback : console.log,
    };
  }

  public generateReports(employeeData: IEmployeeWellnessData[], content: IWellnessContent[]): void {
    if (!this.options.encryptionKey) {
      throw new CustomError('Encryption key is required to generate reports.', 400);
    }

    const encryptedEmployeeData = this.encryptData(employeeData);
    const encryptedContent = this.encryptData(content);

    try {
      // Perform analysis and generate reports using encrypted data
      // ...

      // Decrypt and return the reports
      const decryptedReports = this.decryptData(reports);
      this.options.reportCallback(decryptedReports);
    } catch (error) {
      this.options.reportCallback(error);
    }
  }

  private encryptData(data: any[]): any[] {
    return data.map((item) => encrypt(JSON.stringify(item), this.options.encryptionKey));
  }

  private decryptData(data: any[]): any[] {
    return data.map((item) => {
      try {
        return decrypt(item, this.options.encryptionKey);
      } catch (error) {
        if (isUndefined(error)) return item;
        throw error;
      }
    });
  }
}

export { ReportingEngine };

// Custom Error class for better error handling
export class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

import { IReportingEngine, ReportingEngineOptions, IEmployeeWellnessData, IWellnessContent } from './interfaces';
import { encrypt, decrypt } from '../security/encryption';
import { validate, isUndefined } from '../utils';
import { CustomError } from './custom-error';

class ReportingEngine implements IReportingEngine {
  private options: ReportingEngineOptions;

  constructor(options: ReportingEngineOptions) {
    this.options = {
      ...options,
      encryptionKey: validate.isString(options.encryptionKey) ? options.encryptionKey : 'default_encryption_key',
      reportCallback: validate.isFunction(options.reportCallback) ? options.reportCallback : console.log,
    };
  }

  public generateReports(employeeData: IEmployeeWellnessData[], content: IWellnessContent[]): void {
    if (!this.options.encryptionKey) {
      throw new CustomError('Encryption key is required to generate reports.', 400);
    }

    const encryptedEmployeeData = this.encryptData(employeeData);
    const encryptedContent = this.encryptData(content);

    try {
      // Perform analysis and generate reports using encrypted data
      // ...

      // Decrypt and return the reports
      const decryptedReports = this.decryptData(reports);
      this.options.reportCallback(decryptedReports);
    } catch (error) {
      this.options.reportCallback(error);
    }
  }

  private encryptData(data: any[]): any[] {
    return data.map((item) => encrypt(JSON.stringify(item), this.options.encryptionKey));
  }

  private decryptData(data: any[]): any[] {
    return data.map((item) => {
      try {
        return decrypt(item, this.options.encryptionKey);
      } catch (error) {
        if (isUndefined(error)) return item;
        throw error;
      }
    });
  }
}

export { ReportingEngine };

// Custom Error class for better error handling
export class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}