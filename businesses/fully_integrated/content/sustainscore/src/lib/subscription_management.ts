import { Subscription } from './subscription';
import { validateSubscriptionData, validateCustomerId, validatePositiveNumber } from './validation';

type TaxRate = {
  rate: number;
  minAmount: number;
};

const TAX_RATES: TaxRate[] = [
  { rate: 0.1, minAmount: 100 },
  { rate: 0.2, minAmount: 500 },
];

function add(num1: number, num2: number): number {
  validatePositiveNumber(num1);
  validatePositiveNumber(num2);

  // Perform calculation and return the result
  return num1 + num2;
}

function validateCustomerId(customerId: string): void {
  // Validate customer ID for security and consistency
  // ...
  if (!customerId || customerId.length < 5) {
    throw new Error('Invalid or incomplete customer ID');
  }
}

function createSubscription(customerId: string, duration: number, price: number): Subscription {
  validateCustomerId(customerId);
  validatePositiveNumber(duration);
  validatePositiveNumber(price);

  const subscriptionId = generateSubscriptionId(customerId);
  const totalAmount = add(price, calculateTax(price));

  // Perform additional checks and actions for creating a subscription
  // ...
  if (duration < 1) {
    throw new Error('Invalid subscription duration');
  }

  if (totalAmount > 100000) {
    throw new Error('Total amount exceeds the maximum limit');
  }

  return new Subscription(subscriptionId, customerId, duration, totalAmount);
}

function generateSubscriptionId(customerId: string): string {
  // Generate a unique subscription ID based on the customer ID and current timestamp
  // ...
  const timestamp = new Date().getTime();
  return `${customerId}-${timestamp}`;
}

function calculateTax(price: number): number {
  let tax = 0;

  for (const taxRate of TAX_RATES) {
    if (price >= taxRate.minAmount) {
      tax += price * taxRate.rate;
    } else {
      break;
    }
  }

  // Calculate tax based on the price and applicable tax rates
  return tax;
}

export { createSubscription };

import { Subscription } from './subscription';
import { validateSubscriptionData, validateCustomerId, validatePositiveNumber } from './validation';

type TaxRate = {
  rate: number;
  minAmount: number;
};

const TAX_RATES: TaxRate[] = [
  { rate: 0.1, minAmount: 100 },
  { rate: 0.2, minAmount: 500 },
];

function add(num1: number, num2: number): number {
  validatePositiveNumber(num1);
  validatePositiveNumber(num2);

  // Perform calculation and return the result
  return num1 + num2;
}

function validateCustomerId(customerId: string): void {
  // Validate customer ID for security and consistency
  // ...
  if (!customerId || customerId.length < 5) {
    throw new Error('Invalid or incomplete customer ID');
  }
}

function createSubscription(customerId: string, duration: number, price: number): Subscription {
  validateCustomerId(customerId);
  validatePositiveNumber(duration);
  validatePositiveNumber(price);

  const subscriptionId = generateSubscriptionId(customerId);
  const totalAmount = add(price, calculateTax(price));

  // Perform additional checks and actions for creating a subscription
  // ...
  if (duration < 1) {
    throw new Error('Invalid subscription duration');
  }

  if (totalAmount > 100000) {
    throw new Error('Total amount exceeds the maximum limit');
  }

  return new Subscription(subscriptionId, customerId, duration, totalAmount);
}

function generateSubscriptionId(customerId: string): string {
  // Generate a unique subscription ID based on the customer ID and current timestamp
  // ...
  const timestamp = new Date().getTime();
  return `${customerId}-${timestamp}`;
}

function calculateTax(price: number): number {
  let tax = 0;

  for (const taxRate of TAX_RATES) {
    if (price >= taxRate.minAmount) {
      tax += price * taxRate.rate;
    } else {
      break;
    }
  }

  // Calculate tax based on the price and applicable tax rates
  return tax;
}

export { createSubscription };