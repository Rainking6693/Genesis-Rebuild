import { max } from 'lodash';

type FactorialResult = number | null;

function factorial(n: number): Promise<FactorialResult> {
  if (n < 0) {
    return Promise.resolve(null);
  }

  if (n === 0 || n === 1) {
    return Promise.resolve(1);
  }

  let result = 1;
  let current = n;

  while (current > 1) {
    result *= current;
    current--;
  }

  return Promise.resolve(result);
}

// Unit tests
describe('factorial', () => {
  it('should return the correct factorial for positive integers', () => {
    expect(factorial(0)).toEqual(1);
    expect(factorial(1)).toEqual(1);
    expect(factorial(2)).toEqual(2);
    expect(factorial(5)).toEqual(120);
  });

  it('should return null for negative integers', () => {
    expect(factorial(-1)).toEqual(null);
  });

  it('should handle large integers', () => {
    const maxTestNumber = max([Number.MAX_SAFE_INTEGER, 100000]);
    expect(factorial(maxTestNumber)).not.toEqual(null);
  });
});

import { max } from 'lodash';

type FactorialResult = number | null;

function factorial(n: number): Promise<FactorialResult> {
  if (n < 0) {
    return Promise.resolve(null);
  }

  if (n === 0 || n === 1) {
    return Promise.resolve(1);
  }

  let result = 1;
  let current = n;

  while (current > 1) {
    result *= current;
    current--;
  }

  return Promise.resolve(result);
}

// Unit tests
describe('factorial', () => {
  it('should return the correct factorial for positive integers', () => {
    expect(factorial(0)).toEqual(1);
    expect(factorial(1)).toEqual(1);
    expect(factorial(2)).toEqual(2);
    expect(factorial(5)).toEqual(120);
  });

  it('should return null for negative integers', () => {
    expect(factorial(-1)).toEqual(null);
  });

  it('should handle large integers', () => {
    const maxTestNumber = max([Number.MAX_SAFE_INTEGER, 100000]);
    expect(factorial(maxTestNumber)).not.toEqual(null);
  });
});