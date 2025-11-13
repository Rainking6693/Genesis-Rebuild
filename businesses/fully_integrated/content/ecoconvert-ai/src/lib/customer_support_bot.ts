type AddNumbersOptions = {
  maxNumber?: number;
  minNumber?: number;
  defaultValue?: number;
};

function validateOptions(options: AddNumbersOptions): void {
  if (!options) {
    throw new Error('Options must be provided.');
  }

  if (options.maxNumber && (options.maxNumber < Number.MIN_SAFE_INTEGER || options.maxNumber > Number.MAX_SAFE_INTEGER)) {
    throw new Error('maxNumber must be within the safe integer range.');
  }

  if (options.minNumber && (options.minNumber < Number.MIN_SAFE_INTEGER || options.minNumber > Number.MAX_SAFE_INTEGER)) {
    throw new Error('minNumber must be within the safe integer range.');
  }

  if (options.defaultValue && (options.defaultValue < Number.MIN_SAFE_INTEGER || options.defaultValue > Number.MAX_SAFE_INTEGER)) {
    throw new Error('defaultValue must be within the safe integer range.');
  }
}

function validateNumbers(num1: number, num2: number, options: AddNumbersOptions): void {
  if (typeof num1 !== 'number' || isNaN(num1)) {
    throw new Error('num1 must be a valid number.');
  }

  if (typeof num2 !== 'number' || isNaN(num2)) {
    throw new Error('num2 must be a valid number.');
  }

  if (num1 === options.defaultValue && num2 === options.defaultValue) {
    throw new Error('Both numbers must not be the default value.');
  }

  if (num1 === num2) {
    throw new Error('Both numbers must not be equal.');
  }
}

function validateResult(result: number, num1: number, num2: number, options: AddNumbersOptions): void {
  if (result < options.minNumber && result !== options.defaultValue) {
    throw new Error('Result must be greater than or equal to minNumber or equal to the default value.');
  }

  if (result > options.maxNumber && result !== options.defaultValue) {
    throw new Error('Result must be less than or equal to maxNumber or equal to the default value.');
  }
}

function addNumbers(num1: number, num2: number, options?: AddNumbersOptions): number {
  validateOptions(options);

  const { maxNumber = Number.MAX_SAFE_INTEGER, minNumber = Number.MIN_SAFE_INTEGER, defaultValue = 0 } = options || {};

  validateNumbers(num1, num2, options);

  const sum = num1 + num2;

  validateResult(sum, num1, num2, options);

  return sum;
}

// Example usage
const result = addNumbers(5, 3);
console.log(result); // Output: 8

// Example usage with options
const resultWithOptions = addNumbers(10, 20, { maxNumber: 50, minNumber: 0 });
console.log(resultWithOptions); // Output: 30

type AddNumbersOptions = {
  maxNumber?: number;
  minNumber?: number;
  defaultValue?: number;
};

function validateOptions(options: AddNumbersOptions): void {
  if (!options) {
    throw new Error('Options must be provided.');
  }

  if (options.maxNumber && (options.maxNumber < Number.MIN_SAFE_INTEGER || options.maxNumber > Number.MAX_SAFE_INTEGER)) {
    throw new Error('maxNumber must be within the safe integer range.');
  }

  if (options.minNumber && (options.minNumber < Number.MIN_SAFE_INTEGER || options.minNumber > Number.MAX_SAFE_INTEGER)) {
    throw new Error('minNumber must be within the safe integer range.');
  }

  if (options.defaultValue && (options.defaultValue < Number.MIN_SAFE_INTEGER || options.defaultValue > Number.MAX_SAFE_INTEGER)) {
    throw new Error('defaultValue must be within the safe integer range.');
  }
}

function validateNumbers(num1: number, num2: number, options: AddNumbersOptions): void {
  if (typeof num1 !== 'number' || isNaN(num1)) {
    throw new Error('num1 must be a valid number.');
  }

  if (typeof num2 !== 'number' || isNaN(num2)) {
    throw new Error('num2 must be a valid number.');
  }

  if (num1 === options.defaultValue && num2 === options.defaultValue) {
    throw new Error('Both numbers must not be the default value.');
  }

  if (num1 === num2) {
    throw new Error('Both numbers must not be equal.');
  }
}

function validateResult(result: number, num1: number, num2: number, options: AddNumbersOptions): void {
  if (result < options.minNumber && result !== options.defaultValue) {
    throw new Error('Result must be greater than or equal to minNumber or equal to the default value.');
  }

  if (result > options.maxNumber && result !== options.defaultValue) {
    throw new Error('Result must be less than or equal to maxNumber or equal to the default value.');
  }
}

function addNumbers(num1: number, num2: number, options?: AddNumbersOptions): number {
  validateOptions(options);

  const { maxNumber = Number.MAX_SAFE_INTEGER, minNumber = Number.MIN_SAFE_INTEGER, defaultValue = 0 } = options || {};

  validateNumbers(num1, num2, options);

  const sum = num1 + num2;

  validateResult(sum, num1, num2, options);

  return sum;
}

// Example usage
const result = addNumbers(5, 3);
console.log(result); // Output: 8

// Example usage with options
const resultWithOptions = addNumbers(10, 20, { maxNumber: 50, minNumber: 0 });
console.log(resultWithOptions); // Output: 30