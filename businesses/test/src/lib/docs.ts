import { isNaN, assert } from 'assert';

type Price = number;
type Quantity = number;
type TotalCost = number;

/**
 * Ensures the provided value is a non-negative number.
 *
 * @param value - The value to validate.
 * @throws Error if the value is not a non-negative number.
 */
function assertNonNegative(value: number): asserts value >= 0 {
  if (value < 0) {
    throw new Error('Value must be non-negative.');
  }
}

/**
 * Checks if the provided value is a number.
 *
 * @param value - The value to check.
 * @throws Error if the value is not a number.
 */
function assertNumber(value: any): asserts value is number {
  if (isNaN(value)) {
    throw new Error('Value must be a number.');
  }
}

/**
 * Calculates the total cost of a product based on its price and quantity.
 *
 * @param price - The price of the product.
 * @param quantity - The quantity of the product.
 * @returns The total cost of the product.
 * @throws Error if the price or quantity is not a non-negative number or not a number.
 */
function calculateTotalCost(price: Price, quantity: Quantity): TotalCost {
  assertNumber(price);
  assertNonNegative(price);
  assertNumber(quantity);
  assertNonNegative(quantity);

  // Calculate the total cost by multiplying the price and quantity
  const totalCost = price * quantity;
  return totalCost;
}

// Example usage:
try {
  const productPrice = '10';
  const productQuantity = -5;
  const totalCost = calculateTotalCost(productPrice, productQuantity);
  console.log(`Total cost: ${totalCost}`);
} catch (error) {
  console.error(error.message);
}

import { isNaN, assert } from 'assert';

type Price = number;
type Quantity = number;
type TotalCost = number;

/**
 * Ensures the provided value is a non-negative number.
 *
 * @param value - The value to validate.
 * @throws Error if the value is not a non-negative number.
 */
function assertNonNegative(value: number): asserts value >= 0 {
  if (value < 0) {
    throw new Error('Value must be non-negative.');
  }
}

/**
 * Checks if the provided value is a number.
 *
 * @param value - The value to check.
 * @throws Error if the value is not a number.
 */
function assertNumber(value: any): asserts value is number {
  if (isNaN(value)) {
    throw new Error('Value must be a number.');
  }
}

/**
 * Calculates the total cost of a product based on its price and quantity.
 *
 * @param price - The price of the product.
 * @param quantity - The quantity of the product.
 * @returns The total cost of the product.
 * @throws Error if the price or quantity is not a non-negative number or not a number.
 */
function calculateTotalCost(price: Price, quantity: Quantity): TotalCost {
  assertNumber(price);
  assertNonNegative(price);
  assertNumber(quantity);
  assertNonNegative(quantity);

  // Calculate the total cost by multiplying the price and quantity
  const totalCost = price * quantity;
  return totalCost;
}

// Example usage:
try {
  const productPrice = '10';
  const productQuantity = -5;
  const totalCost = calculateTotalCost(productPrice, productQuantity);
  console.log(`Total cost: ${totalCost}`);
} catch (error) {
  console.error(error.message);
}