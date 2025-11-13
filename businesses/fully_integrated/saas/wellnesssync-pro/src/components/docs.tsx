type SafeNumber = number | string;

function safeSum(a: SafeNumber, b: SafeNumber): number {
  // Convert strings to numbers using try-catch block for better error handling
  const numberA = Number(a);
  if (isNaN(numberA)) {
    throw new Error(`Invalid number: ${a}`);
  }

  const numberB = Number(b);
  if (isNaN(numberB)) {
    throw new Error(`Invalid number: ${b}`);
  }

  // Return the sum of the numbers
  return numberA + numberB;
}

// Usage example
try {
  const sum = safeSum("3", "4");
  console.log(`The sum is: ${sum}`);
} catch (error) {
  console.error(error.message);
}

type SafeNumber = number | string;

function safeSum(a: SafeNumber, b: SafeNumber): number {
  // Convert strings to numbers using try-catch block for better error handling
  const numberA = Number(a);
  if (isNaN(numberA)) {
    throw new Error(`Invalid number: ${a}`);
  }

  const numberB = Number(b);
  if (isNaN(numberB)) {
    throw new Error(`Invalid number: ${b}`);
  }

  // Return the sum of the numbers
  return numberA + numberB;
}

// Usage example
try {
  const sum = safeSum("3", "4");
  console.log(`The sum is: ${sum}`);
} catch (error) {
  console.error(error.message);
}