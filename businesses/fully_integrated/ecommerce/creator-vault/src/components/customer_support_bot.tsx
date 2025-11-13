type NumberOrString = number | string;

function addNumbers(num1: NumberOrString, num2: NumberOrString): number {
  // Convert strings to numbers
  const number1 = Number(num1);
  const number2 = Number(num2);

  // Check if both inputs are numbers
  if (isNaN(number1) || isNaN(number2)) {
    throw new Error("Both inputs must be numbers.");
  }

  // Return the sum of the numbers
  return number1 + number2;
}

type NumberOrString = number | string;

function addNumbers(num1: NumberOrString, num2: NumberOrString): number {
  // Convert strings to numbers
  const number1 = Number(num1);
  const number2 = Number(num2);

  // Check if both inputs are numbers
  if (isNaN(number1) || isNaN(number2)) {
    throw new Error("Both inputs must be numbers.");
  }

  // Return the sum of the numbers
  return number1 + number2;
}