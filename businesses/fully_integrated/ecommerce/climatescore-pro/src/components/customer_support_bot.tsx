import { assert } from 'console';

type NumberOrZero = number | 0;

function validateNumbers(num1: NumberOrZero, num2: NumberOrZero): asserts num1 is number & NumberOrZero & num2 is number & NumberOrZero {
  if (typeof num1 !== 'number' || !Number.isFinite(num1)) {
    throw new Error('First argument must be a finite number');
  }

  if (typeof num2 !== 'number' || !Number.isFinite(num2)) {
    throw new Error('Second argument must be a finite number');
  }
}

export { validateNumbers };

import { validateNumbers } from './validateNumbers';

function calculateSum(num1: NumberOrZero, num2: NumberOrZero): number {
  validateNumbers(num1, num2);

  const firstNumber = Number(num1);
  const secondNumber = Number(num2);

  return firstNumber + secondNumber;
}

export { calculateSum };

import { calculateSum } from './calculateSum';
import { expect } from 'jest';

describe('calculateSum', () => {
  it('should return the correct sum for positive numbers', () => {
    expect(calculateSum(3, 4)).toEqual(7);
  });

  it('should return the correct sum for negative numbers', () => {
    expect(calculateSum(-3, -4)).toEqual(-7);
  });

  it('should return the correct sum for zero', () => {
    expect(calculateSum(0, 4)).toEqual(4);
    expect(calculateSum(4, 0)).toEqual(4);
  });

  it('should handle non-number inputs', () => {
    expect(() => calculateSum('a', 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, 'a')).toThrow('Second argument must be a finite number');
  });

  it('should handle NaN inputs', () => {
    expect(() => calculateSum(NaN, 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, NaN)).toThrow('Second argument must be a finite number');
  });

  it('should handle Infinity inputs', () => {
    expect(() => calculateSum(Infinity, 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, Infinity)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two zeros', () => {
    expect(calculateSum(0, 0)).toEqual(0);
  });

  it('should handle the sum of a negative number and a positive number', () => {
    expect(calculateSum(-3, 4)).toEqual(1);
  });

  it('should handle the sum of a positive number and a negative number', () => {
    expect(calculateSum(3, -4)).toEqual(-1);
  });

  it('should handle the sum of a number and a string', () => {
    expect(() => calculateSum(3, 'a')).toThrow('First argument must be a finite number');
    expect(() => calculateSum('a', 3)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of a string and a number', () => {
    expect(() => calculateSum('a', 3)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(3, 'a')).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two strings', () => {
    expect(calculateSum('a', 'b')).toEqual('ab');
  });

  it('should handle the sum of a number and an object', () => {
    expect(() => calculateSum(3, {})).toThrow('First argument must be a finite number');
    expect(() => calculateSum({}, 3)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of an object and a number', () => {
    expect(() => calculateSum({}, 3)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(3, {})).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two objects', () => {
    expect(calculateSum({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('should handle the sum of a number and null', () => {
    expect(calculateSum(3, null)).toEqual(3);
    expect(calculateSum(null, 3)).toEqual(3);
  });

  it('should handle the sum of null and null', () => {
    expect(calculateSum(null, null)).toEqual(null);
  });

  it('should handle the sum of undefined and a number', () => {
    expect(calculateSum(3, undefined)).toEqual(3);
    expect(calculateSum(undefined, 3)).toEqual(3);
  });

  it('should handle the sum of undefined and undefined', () => {
    expect(calculateSum(undefined, undefined)).toEqual(undefined);
  });
});

import { assert } from 'console';

type NumberOrZero = number | 0;

function validateNumbers(num1: NumberOrZero, num2: NumberOrZero): asserts num1 is number & NumberOrZero & num2 is number & NumberOrZero {
  if (typeof num1 !== 'number' || !Number.isFinite(num1)) {
    throw new Error('First argument must be a finite number');
  }

  if (typeof num2 !== 'number' || !Number.isFinite(num2)) {
    throw new Error('Second argument must be a finite number');
  }
}

export { validateNumbers };

import { validateNumbers } from './validateNumbers';

function calculateSum(num1: NumberOrZero, num2: NumberOrZero): number {
  validateNumbers(num1, num2);

  const firstNumber = Number(num1);
  const secondNumber = Number(num2);

  return firstNumber + secondNumber;
}

export { calculateSum };

import { calculateSum } from './calculateSum';
import { expect } from 'jest';

describe('calculateSum', () => {
  it('should return the correct sum for positive numbers', () => {
    expect(calculateSum(3, 4)).toEqual(7);
  });

  it('should return the correct sum for negative numbers', () => {
    expect(calculateSum(-3, -4)).toEqual(-7);
  });

  it('should return the correct sum for zero', () => {
    expect(calculateSum(0, 4)).toEqual(4);
    expect(calculateSum(4, 0)).toEqual(4);
  });

  it('should handle non-number inputs', () => {
    expect(() => calculateSum('a', 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, 'a')).toThrow('Second argument must be a finite number');
  });

  it('should handle NaN inputs', () => {
    expect(() => calculateSum(NaN, 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, NaN)).toThrow('Second argument must be a finite number');
  });

  it('should handle Infinity inputs', () => {
    expect(() => calculateSum(Infinity, 4)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(4, Infinity)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two zeros', () => {
    expect(calculateSum(0, 0)).toEqual(0);
  });

  it('should handle the sum of a negative number and a positive number', () => {
    expect(calculateSum(-3, 4)).toEqual(1);
  });

  it('should handle the sum of a positive number and a negative number', () => {
    expect(calculateSum(3, -4)).toEqual(-1);
  });

  it('should handle the sum of a number and a string', () => {
    expect(() => calculateSum(3, 'a')).toThrow('First argument must be a finite number');
    expect(() => calculateSum('a', 3)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of a string and a number', () => {
    expect(() => calculateSum('a', 3)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(3, 'a')).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two strings', () => {
    expect(calculateSum('a', 'b')).toEqual('ab');
  });

  it('should handle the sum of a number and an object', () => {
    expect(() => calculateSum(3, {})).toThrow('First argument must be a finite number');
    expect(() => calculateSum({}, 3)).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of an object and a number', () => {
    expect(() => calculateSum({}, 3)).toThrow('First argument must be a finite number');
    expect(() => calculateSum(3, {})).toThrow('Second argument must be a finite number');
  });

  it('should handle the sum of two objects', () => {
    expect(calculateSum({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('should handle the sum of a number and null', () => {
    expect(calculateSum(3, null)).toEqual(3);
    expect(calculateSum(null, 3)).toEqual(3);
  });

  it('should handle the sum of null and null', () => {
    expect(calculateSum(null, null)).toEqual(null);
  });

  it('should handle the sum of undefined and a number', () => {
    expect(calculateSum(3, undefined)).toEqual(3);
    expect(calculateSum(undefined, 3)).toEqual(3);
  });

  it('should handle the sum of undefined and undefined', () => {
    expect(calculateSum(undefined, undefined)).toEqual(undefined);
  });
});

**calculateSum.ts**

**calculateSum.test.ts**