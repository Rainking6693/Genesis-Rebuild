import { isArray, isNumber, isString } from 'lodash';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function validateCartItem(item: CartItem): void {
  if (!item || !isString(item.id) || !isString(item.name) || !isNumber(item.price) || !isNumber(item.quantity)) {
    throw new Error('Invalid CartItem object. Please provide a valid CartItem object.');
  }
}

function validateTaxRate(taxRate: number): void {
  if (!isNumber(taxRate) || taxRate < 0) {
    throw new Error('Invalid tax rate. Please provide a valid and non-negative tax rate.');
  }
}

function calculateTax(price: number, taxRate: number): number {
  // Check if both arguments are numbers
  if (typeof price !== 'number' || typeof taxRate !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Calculate the tax amount
  return price * taxRate;
}

function calculateTotalPrice(items: CartItem[], taxRate: number): number {
  // Validate the arguments
  if (!isArray(items) || items.length === 0) {
    throw new Error('Invalid arguments. Please provide a non-empty array of CartItem objects.');
  }
  validateTaxRate(taxRate);

  let totalPrice = 0;

  // Validate each item in the cart
  for (const item of items) {
    validateCartItem(item);
    totalPrice += item.price * item.quantity;
  }

  // Calculate the total tax amount
  const totalTax = items.reduce((acc, item) => acc + calculateTax(item.price, taxRate), 0);

  // Return the total price including tax
  return totalPrice + totalTax;
}

// Example usage:
const items: CartItem[] = [
  { id: '1', name: 'Item 1', price: 10, quantity: 2 },
  { id: '2', name: 'Item 2', price: 20, quantity: 1 },
];

const taxRate = 0.05; // 5% tax rate

try {
  const totalPrice = calculateTotalPrice(items, taxRate);
  console.log(`Total price: ${totalPrice}`);
} catch (error) {
  console.error(error.message);
}

import { isArray, isNumber, isString } from 'lodash';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function validateCartItem(item: CartItem): void {
  if (!item || !isString(item.id) || !isString(item.name) || !isNumber(item.price) || !isNumber(item.quantity)) {
    throw new Error('Invalid CartItem object. Please provide a valid CartItem object.');
  }
}

function validateTaxRate(taxRate: number): void {
  if (!isNumber(taxRate) || taxRate < 0) {
    throw new Error('Invalid tax rate. Please provide a valid and non-negative tax rate.');
  }
}

function calculateTax(price: number, taxRate: number): number {
  // Check if both arguments are numbers
  if (typeof price !== 'number' || typeof taxRate !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Calculate the tax amount
  return price * taxRate;
}

function calculateTotalPrice(items: CartItem[], taxRate: number): number {
  // Validate the arguments
  if (!isArray(items) || items.length === 0) {
    throw new Error('Invalid arguments. Please provide a non-empty array of CartItem objects.');
  }
  validateTaxRate(taxRate);

  let totalPrice = 0;

  // Validate each item in the cart
  for (const item of items) {
    validateCartItem(item);
    totalPrice += item.price * item.quantity;
  }

  // Calculate the total tax amount
  const totalTax = items.reduce((acc, item) => acc + calculateTax(item.price, taxRate), 0);

  // Return the total price including tax
  return totalPrice + totalTax;
}

// Example usage:
const items: CartItem[] = [
  { id: '1', name: 'Item 1', price: 10, quantity: 2 },
  { id: '2', name: 'Item 2', price: 20, quantity: 1 },
];

const taxRate = 0.05; // 5% tax rate

try {
  const totalPrice = calculateTotalPrice(items, taxRate);
  console.log(`Total price: ${totalPrice}`);
} catch (error) {
  console.error(error.message);
}