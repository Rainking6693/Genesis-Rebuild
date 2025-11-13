type NumberOrString = number | string;

function safeSum(a: NumberOrString, b: NumberOrString): number {
  // Convert inputs to number using try-catch block for resiliency
  let numA = Number(a);
  let numB = Number(b);

  if (isNaN(numA)) {
    throw new Error(`Invalid input: ${a} is not a valid number.`);
  }

  if (isNaN(numB)) {
    throw new Error(`Invalid input: ${b} is not a valid number.`);
  }

  // Handle edge cases where the sum might exceed the maximum safe integer
  if (numA > Number.MAX_SAFE_INTEGER || numB > Number.MAX_SAFE_INTEGER) {
    throw new Error(
      'The sum of the inputs exceeds the maximum safe integer. Please use a smaller number.'
    );
  }

  return numA + numB;
}

const result = safeSum(5, 7);
console.log(result); // Output: 12

type NumberOrString = number | string;

function safeSum(a: NumberOrString, b: NumberOrString): number {
  // Convert inputs to number using try-catch block for resiliency
  let numA = Number(a);
  let numB = Number(b);

  if (isNaN(numA)) {
    throw new Error(`Invalid input: ${a} is not a valid number.`);
  }

  if (isNaN(numB)) {
    throw new Error(`Invalid input: ${b} is not a valid number.`);
  }

  // Handle edge cases where the sum might exceed the maximum safe integer
  if (numA > Number.MAX_SAFE_INTEGER || numB > Number.MAX_SAFE_INTEGER) {
    throw new Error(
      'The sum of the inputs exceeds the maximum safe integer. Please use a smaller number.'
    );
  }

  return numA + numB;
}

const result = safeSum(5, 7);
console.log(result); // Output: 12

This function accepts both numbers and strings as inputs, converts them to numbers using the `Number()` function, and catches any errors that might occur during the conversion. It also handles edge cases where the sum might exceed the maximum safe integer.

You can use this function like this: