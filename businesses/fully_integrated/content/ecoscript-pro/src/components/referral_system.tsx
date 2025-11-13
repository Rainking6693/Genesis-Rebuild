type SafeNumber = number | null | undefined;

function isSafeNumber(value: SafeNumber): value is number {
  return value !== null && value !== undefined;
}

function calculateSum(num1: SafeNumber, num2: SafeNumber): number | undefined {
  if (!isSafeNumber(num1) || !isSafeNumber(num2)) {
    return undefined;
  }

  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  if (Number.isNaN(num1AsNumber) || Number.isNaN(num2AsNumber)) {
    return undefined;
  }

  if (num1AsNumber === 0 && Number.isFinite(num2AsNumber)) {
    return num2AsNumber;
  }

  if (num2AsNumber === 0 && Number.isFinite(num1AsNumber)) {
    return num1AsNumber;
  }

  if (num1AsNumber > 0 && num2AsNumber > 0 && (num1AsNumber + num2AsNumber) < 0) {
    return -(num1AsNumber + num2AsNumber);
  }

  if (num1AsNumber < 0 && num2AsNumber < 0 && (num1AsNumber + num2AsNumber) > 0) {
    return num1AsNumber + num2AsNumber;
  }

  if (num1AsNumber > Number.MAX_SAFE_INTEGER || num2AsNumber > Number.MAX_SAFE_INTEGER) {
    return num1AsNumber + num2AsNumber > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  }

  return num1AsNumber + num2AsNumber;
}

// Example usage:
const result = calculateSum(1, 2); // number
const result2 = calculateSum(1, null); // undefined
const result3 = calculateSum(undefined, 2); // undefined
const result4 = calculateSum(1, Infinity); // undefined
const result5 = calculateSum(Infinity, 1); // number
const result6 = calculateSum(-1, -2); // number
const result7 = calculateSum(-1, Number.MAX_SAFE_INTEGER); // number
const result8 = calculateSum(Number.MAX_SAFE_INTEGER, -1); // number

type SafeNumber = number | null | undefined;

function isSafeNumber(value: SafeNumber): value is number {
  return value !== null && value !== undefined;
}

function calculateSum(num1: SafeNumber, num2: SafeNumber): number | undefined {
  if (!isSafeNumber(num1) || !isSafeNumber(num2)) {
    return undefined;
  }

  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  if (Number.isNaN(num1AsNumber) || Number.isNaN(num2AsNumber)) {
    return undefined;
  }

  if (num1AsNumber === 0 && Number.isFinite(num2AsNumber)) {
    return num2AsNumber;
  }

  if (num2AsNumber === 0 && Number.isFinite(num1AsNumber)) {
    return num1AsNumber;
  }

  if (num1AsNumber > 0 && num2AsNumber > 0 && (num1AsNumber + num2AsNumber) < 0) {
    return -(num1AsNumber + num2AsNumber);
  }

  if (num1AsNumber < 0 && num2AsNumber < 0 && (num1AsNumber + num2AsNumber) > 0) {
    return num1AsNumber + num2AsNumber;
  }

  if (num1AsNumber > Number.MAX_SAFE_INTEGER || num2AsNumber > Number.MAX_SAFE_INTEGER) {
    return num1AsNumber + num2AsNumber > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  }

  return num1AsNumber + num2AsNumber;
}

// Example usage:
const result = calculateSum(1, 2); // number
const result2 = calculateSum(1, null); // undefined
const result3 = calculateSum(undefined, 2); // undefined
const result4 = calculateSum(1, Infinity); // undefined
const result5 = calculateSum(Infinity, 1); // number
const result6 = calculateSum(-1, -2); // number
const result7 = calculateSum(-1, Number.MAX_SAFE_INTEGER); // number
const result8 = calculateSum(Number.MAX_SAFE_INTEGER, -1); // number