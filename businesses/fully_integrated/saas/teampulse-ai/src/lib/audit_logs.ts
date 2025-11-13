import { AuditLog, LogLevel } from './audit_logs';
import { encrypt, decrypt } from './security';

type LogEntry = {
  level: LogLevel;
  message: string;
};

interface AddTwoNumbersOptions {
  logLevel?: LogLevel;
  logMessage?: string;
}

function addTwoNumbers(num1: number, num2: number, options: AddTwoNumbersOptions = {}): number {
  // Customize log level and message
  const logLevel = options.logLevel || LogLevel.INFO;
  const logMessage = options.logMessage || `Adding numbers: ${num1} and ${num2}`;

  // Log the operation for audit purposes
  const logEntry: LogEntry = {
    level: logLevel,
    message: logMessage,
  };
  AuditLog.log(logEntry);

  // Check for NaN values and log an error
  if (isNaN(num1) || isNaN(num2)) {
    const errorLogEntry: LogEntry = {
      level: LogLevel.ERROR,
      message: 'Invalid numbers provided',
    };
    AuditLog.log(errorLogEntry);
    throw new Error('Invalid numbers provided');
  }

  // Encrypt the numbers for security
  const encryptedNum1 = encrypt(num1.toString());
  const encryptedNum2 = encrypt(num2.toString());

  // Perform addition on encrypted numbers (for performance and privacy)
  const encryptedSum = encrypt((num1 + num2).toString());

  // Decrypt the sum and return the result
  return decrypt(encryptedSum);
}

import { AuditLog, LogLevel } from './audit_logs';
import { encrypt, decrypt } from './security';

type LogEntry = {
  level: LogLevel;
  message: string;
};

interface AddTwoNumbersOptions {
  logLevel?: LogLevel;
  logMessage?: string;
}

function addTwoNumbers(num1: number, num2: number, options: AddTwoNumbersOptions = {}): number {
  // Customize log level and message
  const logLevel = options.logLevel || LogLevel.INFO;
  const logMessage = options.logMessage || `Adding numbers: ${num1} and ${num2}`;

  // Log the operation for audit purposes
  const logEntry: LogEntry = {
    level: logLevel,
    message: logMessage,
  };
  AuditLog.log(logEntry);

  // Check for NaN values and log an error
  if (isNaN(num1) || isNaN(num2)) {
    const errorLogEntry: LogEntry = {
      level: LogLevel.ERROR,
      message: 'Invalid numbers provided',
    };
    AuditLog.log(errorLogEntry);
    throw new Error('Invalid numbers provided');
  }

  // Encrypt the numbers for security
  const encryptedNum1 = encrypt(num1.toString());
  const encryptedNum2 = encrypt(num2.toString());

  // Perform addition on encrypted numbers (for performance and privacy)
  const encryptedSum = encrypt((num1 + num2).toString());

  // Decrypt the sum and return the result
  return decrypt(encryptedSum);
}