type NumberType = number | string;

function safeSum(num1: NumberType, num2: NumberType): number {
  // Convert strings to numbers using try-catch block for resiliency
  const number1 = Number(num1);
  if (isNaN(number1)) {
    throw new Error(`Invalid number: ${num1}`);
  }

  const number2 = Number(num2);
  if (isNaN(number2)) {
    throw new Error(`Invalid number: ${num2}`);
  }

  // Check for edge cases like NaN and Infinity
  if (isNaN(number1 + number2)) {
    throw new Error("Sum of numbers is NaN");
  }

  if (Number.isFinite(number1) && Number.isFinite(number2)) {
    return number1 + number2;
  } else {
    throw new Error("One or both numbers are not finite");
  }
}

type NumberType = number | string;

function safeSum(num1: NumberType, num2: NumberType): number {
  // Convert strings to numbers using try-catch block for resiliency
  const number1 = Number(num1);
  if (isNaN(number1)) {
    throw new Error(`Invalid number: ${num1}`);
  }

  const number2 = Number(num2);
  if (isNaN(number2)) {
    throw new Error(`Invalid number: ${num2}`);
  }

  // Check for edge cases like NaN and Infinity
  if (isNaN(number1 + number2)) {
    throw new Error("Sum of numbers is NaN");
  }

  if (Number.isFinite(number1) && Number.isFinite(number2)) {
    return number1 + number2;
  } else {
    throw new Error("One or both numbers are not finite");
  }
}