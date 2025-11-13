import { isNaN } from 'math-expression-evaluator';

// Function to validate the input fields
function validateInputFields(num1Input: HTMLInputElement, num2Input: HTMLInputElement): void {
  if (isNaN(Number(num1Input.value)) || isNaN(Number(num2Input.value))) {
    alert('Invalid input. Both numbers must be finite.');
    num1Input.value = '';
    num2Input.value = '';
  }
}

// Function to clear the result
function clearResult(result: HTMLDivElement): void {
  result.textContent = '';
}

// Function to sum two numbers with SEO-optimized comments, type annotations, and accessibility features.
function sumNumbersSEO(num1: number, num2: number): number {
  // Check for NaN or Infinity input
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Invalid input. Both numbers must be finite.');
  }

  // Check for zero division
  if (num2 === 0) {
    throw new Error('Division by zero is not allowed.');
  }

  // Check for negative numbers and handle the case when the sum is positive
  if (num1 < 0 && num2 < 0) {
    num1 = -num1;
    num2 = -num2;
  }

  // Check for overflow
  if (num1 > Number.MAX_SAFE_INTEGER - num2) {
    throw new Error('Overflow error. The sum is too large.');
  }

  // Check for underflow
  if (num1 < Number.MIN_SAFE_INTEGER + num2) {
    throw new Error('Underflow error. The sum is too small.');
  }

  // Perform the addition operation
  const sum: number = num1 + num2;

  // SEO-optimized comments for better understanding and accessibility
  // eslint-disable-next-line no-console
  console.info(`Summing numbers ${num1} and ${num2}`);

  // Return the calculated sum
  return sum;
}

// Example usage with ARIA attributes for accessibility
const num1Input = document.getElementById('num1') as HTMLInputElement;
const num2Input = document.getElementById('num2') as HTMLInputElement;
const result = document.getElementById('result') as HTMLDivElement;

num1Input.setAttribute('aria-label', 'First number');
num2Input.setAttribute('aria-label', 'Second number');
result.setAttribute('aria-label', 'Sum of the two numbers');

// Event listener for the sum button
const sumButton = document.getElementById('sumButton') as HTMLButtonElement;
sumButton.addEventListener('click', () => {
  validateInputFields(num1Input, num2Input);

  clearResult(result);

  sumNumbersSEO(Number(num1Input.value), Number(num2Input.value))
    .then((sum) => {
      result.textContent = `Sum: ${sum}`;
    })
    .catch((error) => {
      alert(error.message);
    });
});

import { isNaN } from 'math-expression-evaluator';

// Function to validate the input fields
function validateInputFields(num1Input: HTMLInputElement, num2Input: HTMLInputElement): void {
  if (isNaN(Number(num1Input.value)) || isNaN(Number(num2Input.value))) {
    alert('Invalid input. Both numbers must be finite.');
    num1Input.value = '';
    num2Input.value = '';
  }
}

// Function to clear the result
function clearResult(result: HTMLDivElement): void {
  result.textContent = '';
}

// Function to sum two numbers with SEO-optimized comments, type annotations, and accessibility features.
function sumNumbersSEO(num1: number, num2: number): number {
  // Check for NaN or Infinity input
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Invalid input. Both numbers must be finite.');
  }

  // Check for zero division
  if (num2 === 0) {
    throw new Error('Division by zero is not allowed.');
  }

  // Check for negative numbers and handle the case when the sum is positive
  if (num1 < 0 && num2 < 0) {
    num1 = -num1;
    num2 = -num2;
  }

  // Check for overflow
  if (num1 > Number.MAX_SAFE_INTEGER - num2) {
    throw new Error('Overflow error. The sum is too large.');
  }

  // Check for underflow
  if (num1 < Number.MIN_SAFE_INTEGER + num2) {
    throw new Error('Underflow error. The sum is too small.');
  }

  // Perform the addition operation
  const sum: number = num1 + num2;

  // SEO-optimized comments for better understanding and accessibility
  // eslint-disable-next-line no-console
  console.info(`Summing numbers ${num1} and ${num2}`);

  // Return the calculated sum
  return sum;
}

// Example usage with ARIA attributes for accessibility
const num1Input = document.getElementById('num1') as HTMLInputElement;
const num2Input = document.getElementById('num2') as HTMLInputElement;
const result = document.getElementById('result') as HTMLDivElement;

num1Input.setAttribute('aria-label', 'First number');
num2Input.setAttribute('aria-label', 'Second number');
result.setAttribute('aria-label', 'Sum of the two numbers');

// Event listener for the sum button
const sumButton = document.getElementById('sumButton') as HTMLButtonElement;
sumButton.addEventListener('click', () => {
  validateInputFields(num1Input, num2Input);

  clearResult(result);

  sumNumbersSEO(Number(num1Input.value), Number(num2Input.value))
    .then((sum) => {
      result.textContent = `Sum: ${sum}`;
    })
    .catch((error) => {
      alert(error.message);
    });
});