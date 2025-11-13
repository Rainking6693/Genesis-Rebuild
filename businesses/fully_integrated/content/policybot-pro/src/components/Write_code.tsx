import { isNaN } from 'lodash';

type NumberOrString = number | string | null | undefined;

function isValidNumber(value: NumberOrString): value is number {
  return !isNaN(Number(value)) && value !== null && value !== undefined;
}

function addNumbers(num1: NumberOrString, num2: NumberOrString): number | BigInt {
  // Convert strings to numbers and handle BigInts
  const num1AsNumber = typeof num1 === 'string' ? BigInt(BigInt(num1)) : num1;
  const num2AsNumber = typeof num2 === 'string' ? BigInt(BigInt(num2)) : num2;

  // Check for NaN values, null, undefined, and invalid types
  if (isNaN(num1AsNumber) || num1AsNumber === null || num1AsNumber === undefined || typeof num2AsNumber !== 'number' && typeof num2AsNumber !== 'bigint') {
    throw new Error("Both numbers must be valid numbers or BigInts.");
  }

  // Perform addition
  const result = num1AsNumber + num2AsNumber;

  // Return the result as number or BigInt
  return typeof num1AsNumber === 'bigint' ? result : Number(result);
}