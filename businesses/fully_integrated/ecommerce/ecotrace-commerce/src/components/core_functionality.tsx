type SafeNumber = number | null | undefined;

function isSafeNumber(num: SafeNumber): num is number {
  return num !== null && num !== undefined;
}

function isValidNumber(num: SafeNumber): num is number {
  return typeof num === 'number' && !Number.isNaN(num) && !Number.isInfinite(num);
}

function isWithinSafeRange(num: number): boolean {
  return Math.abs(num) <= Number.MAX_SAFE_INTEGER;
}

function hasPrecision(num: number, precision: number = 7): boolean {
  const epsilon = 10 ** -precision;
  return Math.abs(num - Math.round(num)) <= epsilon;
}

function sum(num1: SafeNumber, num2: SafeNumber): (number | null | undefined) {
  if (!isSafeNumber(num1) || !isSafeNumber(num2)) {
    return null;
  }

  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw new Error("Both numbers must be valid numbers.");
  }

  if (!isWithinSafeRange(num1) || !isWithinSafeRange(num2)) {
    throw new Error("Both numbers must be within the safe range of JavaScript numbers.");
  }

  if (!hasPrecision(num1) || !hasPrecision(num2)) {
    throw new Error("Both numbers must have a precision of at least 7 decimal places.");
  }

  // Return the sum of the two numbers
  return num1 + num2;
}

type SafeNumber = number | null | undefined;

function isSafeNumber(num: SafeNumber): num is number {
  return num !== null && num !== undefined;
}

function isValidNumber(num: SafeNumber): num is number {
  return typeof num === 'number' && !Number.isNaN(num) && !Number.isInfinite(num);
}

function isWithinSafeRange(num: number): boolean {
  return Math.abs(num) <= Number.MAX_SAFE_INTEGER;
}

function hasPrecision(num: number, precision: number = 7): boolean {
  const epsilon = 10 ** -precision;
  return Math.abs(num - Math.round(num)) <= epsilon;
}

function sum(num1: SafeNumber, num2: SafeNumber): (number | null | undefined) {
  if (!isSafeNumber(num1) || !isSafeNumber(num2)) {
    return null;
  }

  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw new Error("Both numbers must be valid numbers.");
  }

  if (!isWithinSafeRange(num1) || !isWithinSafeRange(num2)) {
    throw new Error("Both numbers must be within the safe range of JavaScript numbers.");
  }

  if (!hasPrecision(num1) || !hasPrecision(num2)) {
    throw new Error("Both numbers must have a precision of at least 7 decimal places.");
  }

  // Return the sum of the two numbers
  return num1 + num2;
}