import { Logger, InternalServerErrorException } from '@nestjs/common';
import { isNumber } from 'util';

export interface LogEntry {
  level: 'error' | 'log';
  message: string;
}

export function sum(num1: number | string, num2: number | string): number {
  const logger = new Logger('sum');
  const logEntries: LogEntry[] = [];

  // Convert non-number inputs to strings and trim whitespace
  const num1AsString = typeof num1 === 'string' ? num1.trim() : String(num1);
  const num2AsString = typeof num2 === 'string' ? num2.trim() : String(num2);

  if (!isNumber(Number(num1AsString)) || !isNumber(Number(num2AsString))) {
    logEntries.push({ level: 'error', message: `Invalid arguments: num1=${num1AsString}, num2=${num2AsString}` });
  }

  if (logEntries.length > 0) {
    logEntries.forEach((entry) => logger[entry.level](entry.message));
    throw new InternalServerErrorException(logEntries.map((entry) => entry.message).join(', '));
  }

  logger.log(`Summing ${num1} and ${num2}`);
  return Number(num1AsString) + Number(num2AsString);
}

import { Logger, InternalServerErrorException } from '@nestjs/common';
import { isNumber } from 'util';

export interface LogEntry {
  level: 'error' | 'log';
  message: string;
}

export function sum(num1: number | string, num2: number | string): number {
  const logger = new Logger('sum');
  const logEntries: LogEntry[] = [];

  // Convert non-number inputs to strings and trim whitespace
  const num1AsString = typeof num1 === 'string' ? num1.trim() : String(num1);
  const num2AsString = typeof num2 === 'string' ? num2.trim() : String(num2);

  if (!isNumber(Number(num1AsString)) || !isNumber(Number(num2AsString))) {
    logEntries.push({ level: 'error', message: `Invalid arguments: num1=${num1AsString}, num2=${num2AsString}` });
  }

  if (logEntries.length > 0) {
    logEntries.forEach((entry) => logger[entry.level](entry.message));
    throw new InternalServerErrorException(logEntries.map((entry) => entry.message).join(', '));
  }

  logger.log(`Summing ${num1} and ${num2}`);
  return Number(num1AsString) + Number(num2AsString);
}