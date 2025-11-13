type NumberType = number | string;

function sumNumbers(num1: NumberType, num2: NumberType): number | undefined {
  // Validate input types
  if (typeof num1 !== 'number' && typeof num1 !== 'string') {
    throw new Error('Invalid input type for num1');
  }
  if (typeof num2 !== 'number' && typeof num2 !== 'string') {
    throw new Error('Invalid input type for num2');
  }

  // Convert strings to numbers
  let convertedNum1 = Number(num1);
  let convertedNum2 = Number(num2);

  // Handle edge cases: NaN, Infinity, and negative numbers
  if (isNaN(convertedNum1)) {
    throw new Error('Invalid number for num1');
  }
  if (isNaN(convertedNum2)) {
    throw new Error('Invalid number for num2');
  }
  if (convertedNum1 < 0) {
    convertedNum1 = -convertedNum1;
  }
  if (convertedNum2 < 0) {
    convertedNum2 = -convertedNum2;
  }

  // Calculate the sum and return the result
  return convertedNum1 + convertedNum2;
}

type NumberType = number | string;

function sumNumbers(num1: NumberType, num2: NumberType): number | undefined {
  // Validate input types
  if (typeof num1 !== 'number' && typeof num1 !== 'string') {
    throw new Error('Invalid input type for num1');
  }
  if (typeof num2 !== 'number' && typeof num2 !== 'string') {
    throw new Error('Invalid input type for num2');
  }

  // Convert strings to numbers
  let convertedNum1 = Number(num1);
  let convertedNum2 = Number(num2);

  // Handle edge cases: NaN, Infinity, and negative numbers
  if (isNaN(convertedNum1)) {
    throw new Error('Invalid number for num1');
  }
  if (isNaN(convertedNum2)) {
    throw new Error('Invalid number for num2');
  }
  if (convertedNum1 < 0) {
    convertedNum1 = -convertedNum1;
  }
  if (convertedNum2 < 0) {
    convertedNum2 = -convertedNum2;
  }

  // Calculate the sum and return the result
  return convertedNum1 + convertedNum2;
}