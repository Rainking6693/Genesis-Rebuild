import { ErrorWithInfo } from './CustomError';

type NumberOrString = number | string | null | undefined;

function isValidNumber(value: NumberOrString): value is number {
  if (value === null || value === undefined) {
    return false;
  }

  const num = Number(value);
  return !isNaN(num) && !isInfinity(num) && typeof num === 'number';
}

function isInfinity(value: any): value is number {
  return value !== value;
}

function addNumbers(num1: NumberOrString, num2: NumberOrString): number {
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw new ErrorWithInfo('Both arguments must be numbers.', {
      num1Type: typeof num1,
      num2Type: typeof num2,
    });
  }

  // Perform the addition and return the result
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  if (num1AsNumber < 0 && typeof num1AsNumber === 'number' && typeof num2 === 'string') {
    throw new ErrorWithInfo('Negative numbers should not be added as strings.', {
      num1: num1AsNumber,
      num2Type: typeof num2,
    });
  }

  return num1AsNumber + num2AsNumber;
}

class ErrorWithInfo extends Error {
  constructor(message: string, public additionalInfo: { [key: string]: any }) {
    super(message);
    this.name = this.constructor.name;
    this.messageId = `error_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.stack = new Error(message).stack;
  }
}

import { ErrorWithInfo } from './CustomError';

type NumberOrString = number | string | null | undefined;

function isValidNumber(value: NumberOrString): value is number {
  if (value === null || value === undefined) {
    return false;
  }

  const num = Number(value);
  return !isNaN(num) && !isInfinity(num) && typeof num === 'number';
}

function isInfinity(value: any): value is number {
  return value !== value;
}

function addNumbers(num1: NumberOrString, num2: NumberOrString): number {
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw new ErrorWithInfo('Both arguments must be numbers.', {
      num1Type: typeof num1,
      num2Type: typeof num2,
    });
  }

  // Perform the addition and return the result
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  if (num1AsNumber < 0 && typeof num1AsNumber === 'number' && typeof num2 === 'string') {
    throw new ErrorWithInfo('Negative numbers should not be added as strings.', {
      num1: num1AsNumber,
      num2Type: typeof num2,
    });
  }

  return num1AsNumber + num2AsNumber;
}

class ErrorWithInfo extends Error {
  constructor(message: string, public additionalInfo: { [key: string]: any }) {
    super(message);
    this.name = this.constructor.name;
    this.messageId = `error_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.stack = new Error(message).stack;
  }
}