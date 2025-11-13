import assert from 'assert';
import { describe, it, expect } from '@jest/globals';

type AddTwoNumbersReturnType = number | Partial<{ message: string }>;

function addTwoNumbers(num1: number, num2: number, ...args: number[]): AddTwoNumbersReturnType {
  if (args.length > 0) {
    throw new Error("addTwoNumbers expects exactly two arguments.");
  }

  assert.ok(typeof num1 === 'number', `First argument must be a number. Received: ${num1}`);
  assert.ok(typeof num2 === 'number', `Second argument must be a number. Received: ${num2}`);

  const sum = num1 + num2;

  if (isNaN(sum)) {
    return 0;
  }

  return sum;
}

describe('addTwoNumbers', () => {
  it('adds two numbers correctly', () => {
    expect(addTwoNumbers(2, 3)).toBe(5);
  });

  it('handles NaN values correctly', () => {
    expect(addTwoNumbers(2, NaN)).toBe(0);
  });

  it('throws an error when the number of arguments is not exactly two', () => {
    expect(() => addTwoNumbers(2, 3, 4)).toThrow('addTwoNumbers expects exactly two arguments.');
  });

  it('throws an error when the first argument is not a number', () => {
    expect(() => addTwoNumbers('2', 3)).toThrow('First argument must be a number. Received: 2');
  });

  it('throws an error when the second argument is not a number', () => {
    expect(() => addTwoNumbers(2, '3')).toThrow('Second argument must be a number. Received: 3');
  });
});

import assert from 'assert';
import { describe, it, expect } from '@jest/globals';

type AddTwoNumbersReturnType = number | Partial<{ message: string }>;

function addTwoNumbers(num1: number, num2: number, ...args: number[]): AddTwoNumbersReturnType {
  if (args.length > 0) {
    throw new Error("addTwoNumbers expects exactly two arguments.");
  }

  assert.ok(typeof num1 === 'number', `First argument must be a number. Received: ${num1}`);
  assert.ok(typeof num2 === 'number', `Second argument must be a number. Received: ${num2}`);

  const sum = num1 + num2;

  if (isNaN(sum)) {
    return 0;
  }

  return sum;
}

describe('addTwoNumbers', () => {
  it('adds two numbers correctly', () => {
    expect(addTwoNumbers(2, 3)).toBe(5);
  });

  it('handles NaN values correctly', () => {
    expect(addTwoNumbers(2, NaN)).toBe(0);
  });

  it('throws an error when the number of arguments is not exactly two', () => {
    expect(() => addTwoNumbers(2, 3, 4)).toThrow('addTwoNumbers expects exactly two arguments.');
  });

  it('throws an error when the first argument is not a number', () => {
    expect(() => addTwoNumbers('2', 3)).toThrow('First argument must be a number. Received: 2');
  });

  it('throws an error when the second argument is not a number', () => {
    expect(() => addTwoNumbers(2, '3')).toThrow('Second argument must be a number. Received: 3');
  });
});