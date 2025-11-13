import { expect } from 'chai';
import { describe, test, beforeEach } from '@jest/globals';

describe('Addition', () => {
  let add: (a: number | undefined | null, b: number | undefined | null) => number;

  beforeEach(() => {
    add = (a, b) => (a !== undefined && b !== undefined) ? a + b : undefined;
  });

  it('should correctly add two numbers', () => {
    expect(add(2, 3)).toEqual(5);
    expect(add(-1, 2)).toEqual(1);
    expect(add(0, 0)).toEqual(0);
  });

  it('should handle negative numbers', () => {
    expect(add(-2, -3)).toEqual(-5);
    expect(add(-1, -2)).toEqual(-3);
  });

  it('should handle non-numeric inputs', () => {
    expect(add('a', 3)).toBeUndefined();
    expect(add(3, 'b')).toBeUndefined();
  });

  it('should handle large numbers', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 1)).toBeLessThan(Number.MAX_SAFE_INTEGER * 2);
    expect(add(Number.MIN_SAFE_INTEGER, -1)).toBeGreaterThan(Number.MIN_SAFE_INTEGER * -2);
  });

  it('should handle zero division', () => {
    expect(add(3, 0)).toEqual(3);
  });

  it('should handle NaN values', () => {
    expect(add(Number.NaN, 3)).toBeUndefined();
    expect(add(3, Number.NaN)).toBeUndefined();
  });

  it('should handle undefined and null values', () => {
    expect(add(undefined, 3)).toBeUndefined();
    expect(add(3, undefined)).toBeUndefined();
    expect(add(null, 3)).toBeUndefined();
    expect(add(3, null)).toBeUndefined();
  });

  it('should be a pure function', () => {
    const a = 2;
    const b = 3;
    const result1 = add(a, b);
    const result2 = add(a, b);
    expect(result1).toEqual(result2);
  });

  it('should handle the correct order of operands', () => {
    expect(add(2, 3)).toEqual(5);
    expect(add(3, 2)).toEqual(5);
  });
});

import { expect } from 'chai';
import { describe, test, beforeEach } from '@jest/globals';

describe('Addition', () => {
  let add: (a: number | undefined | null, b: number | undefined | null) => number;

  beforeEach(() => {
    add = (a, b) => (a !== undefined && b !== undefined) ? a + b : undefined;
  });

  it('should correctly add two numbers', () => {
    expect(add(2, 3)).toEqual(5);
    expect(add(-1, 2)).toEqual(1);
    expect(add(0, 0)).toEqual(0);
  });

  it('should handle negative numbers', () => {
    expect(add(-2, -3)).toEqual(-5);
    expect(add(-1, -2)).toEqual(-3);
  });

  it('should handle non-numeric inputs', () => {
    expect(add('a', 3)).toBeUndefined();
    expect(add(3, 'b')).toBeUndefined();
  });

  it('should handle large numbers', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 1)).toBeLessThan(Number.MAX_SAFE_INTEGER * 2);
    expect(add(Number.MIN_SAFE_INTEGER, -1)).toBeGreaterThan(Number.MIN_SAFE_INTEGER * -2);
  });

  it('should handle zero division', () => {
    expect(add(3, 0)).toEqual(3);
  });

  it('should handle NaN values', () => {
    expect(add(Number.NaN, 3)).toBeUndefined();
    expect(add(3, Number.NaN)).toBeUndefined();
  });

  it('should handle undefined and null values', () => {
    expect(add(undefined, 3)).toBeUndefined();
    expect(add(3, undefined)).toBeUndefined();
    expect(add(null, 3)).toBeUndefined();
    expect(add(3, null)).toBeUndefined();
  });

  it('should be a pure function', () => {
    const a = 2;
    const b = 3;
    const result1 = add(a, b);
    const result2 = add(a, b);
    expect(result1).toEqual(result2);
  });

  it('should handle the correct order of operands', () => {
    expect(add(2, 3)).toEqual(5);
    expect(add(3, 2)).toEqual(5);
  });
});