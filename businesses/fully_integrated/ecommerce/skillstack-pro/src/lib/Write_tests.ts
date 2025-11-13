import { AddNumbersFunction } from './addNumbersFunction';
import { TestBed } from '@angular/core/testing';

describe('AddNumbersFunction', () => {
  let addNumbers: AddNumbersFunction;

  beforeAll(() => {
    jest.spyOn(Math, 'pow').mockImplementation((_, __) => 0);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    addNumbers = TestBed.inject(AddNumbersFunction);
  });

  it('should correctly add two numbers', () => {
    expect(addNumbers.add(2, 3)).toEqual(5);
    expect(addNumbers.add(-2, 3)).toEqual(1);
    expect(addNumbers.add(-2, -3)).toEqual(-5);
  });

  it('should handle negative numbers', () => {
    expect(addNumbers.add(-5, -3)).toEqual(-8);
    expect(addNumbers.add(-0, -3)).toEqual(-3);
  });

  it('should handle zero as an input', () => {
    expect(addNumbers.add(0, 3)).toEqual(3);
    expect(addNumbers.add(-3, 0)).toEqual(-3);
    expect(addNumbers.add(0, 0)).toEqual(0);
  });

  it('should handle empty inputs', () => {
    expect(addNumbers.add(undefined, undefined)).toEqual(undefined);
    expect(addNumbers.add(null, null)).toEqual(null);
    expect(addNumbers.add(NaN, NaN)).toEqual(NaN);
    expect(addNumbers.add(Infinity, Infinity)).toEqual(Infinity);
    expect(addNumbers.add(-Infinity, -Infinity)).toEqual(-Infinity);
  });

  it('should handle inputs that are not numbers', () => {
    expect(() => addNumbers.add('a', 3)).toThrow('Input must be a number');
    expect(() => addNumbers.add(3, 'a')).toThrow('Input must be a number');
    expect(() => addNumbers.add({}, 3)).toThrow('Input must be a number');
    expect(() => addNumbers.add(function () {}, 3)).toThrow('Input must be a number');
  });

  it('should handle large numbers', () => {
    const largeNumber1 = Math.pow(2, 53) - 1;
    const largeNumber2 = Math.pow(2, 53);
    expect(addNumbers.add(largeNumber1, 1)).toEqual(largeNumber2);
  });

  it('should handle NaN as an input', () => {
    expect(addNumbers.add(NaN, 3)).toEqual(NaN);
    expect(addNumbers.add(3, NaN)).toEqual(NaN);
  });

  it('should handle Infinity as an input', () => {
    expect(addNumbers.add(Infinity, 3)).toEqual(Infinity);
    expect(addNumbers.add(-Infinity, 3)).toEqual(-Infinity);
    expect(addNumbers.add(3, Infinity)).toEqual(Infinity);
    expect(addNumbers.add(3, -Infinity)).toEqual(-Infinity);
  });

  it('should handle large negative numbers', () => {
    const largeNegativeNumber = -Math.pow(2, 53) + 1;
    expect(addNumbers.add(largeNegativeNumber, 1)).toEqual(largeNegativeNumber - 1);
  });

  it('should handle very large numbers', () => {
    const veryLargeNumber1 = Math.pow(2, 1024) - 1;
    const veryLargeNumber2 = Math.pow(2, 1024);
    expect(addNumbers.add(veryLargeNumber1, 1)).toEqual(veryLargeNumber2);
  });

  it('should handle very small numbers', () => {
    const verySmallNumber1 = 2 ** -1024;
    const verySmallNumber2 = 2 ** -1023;
    expect(addNumbers.add(verySmallNumber1, verySmallNumber2)).toEqual(verySmallNumber1 * 2);
  });

  it('should return a number', () => {
    expectTypeOf(addNumbers.add(2, 3)).toBeTypeOf('number');
  });

  // Accessibility test for screen reader tools
  describe('Accessible AddNumbersFunction', () => {
    it('should provide a meaningful name for the AddNumbersFunction', () => {
      expect(addNumbers).toHaveProperty('name', 'AddNumbersFunction');
    });

    it('should provide a meaningful string representation for the AddNumbersFunction', () => {
      expect(addNumbers.toString()).toMatch(/AddNumbersFunction\((.+?)\)/);
    });

    it('should provide a meaningful JSON representation for the AddNumbersFunction', () => {
      expect(JSON.stringify(addNumbers)).toMatch(/AddNumbersFunction\((.+?)\)/);
    });

    it('should provide a meaningful name property for the AddNumbersFunction', () => {
      expect(addNumbers.name).toEqual('AddNumbersFunction');
    });

    it('should provide a meaningful displayName property for the AddNumbersFunction', () => {
      expect(addNumbers.displayName).toEqual('AddNumbersFunction');
    });

    it('should provide a constructor property for the AddNumbersFunction', () => {
      expect(addNumbers.constructor).toEqual(AddNumbersFunction);
    });

    it('should provide a prototype property for the AddNumbersFunction', () => {
      expect(addNumbers.prototype).toEqual(AddNumbersFunction.prototype);
    });

    it('should provide a length property for the AddNumbersFunction', () => {
      expect(addNumbers.length).toEqual(2);
    });
  });
});

import { AddNumbersFunction } from './addNumbersFunction';
import { TestBed } from '@angular/core/testing';

describe('AddNumbersFunction', () => {
  let addNumbers: AddNumbersFunction;

  beforeAll(() => {
    jest.spyOn(Math, 'pow').mockImplementation((_, __) => 0);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    addNumbers = TestBed.inject(AddNumbersFunction);
  });

  it('should correctly add two numbers', () => {
    expect(addNumbers.add(2, 3)).toEqual(5);
    expect(addNumbers.add(-2, 3)).toEqual(1);
    expect(addNumbers.add(-2, -3)).toEqual(-5);
  });

  it('should handle negative numbers', () => {
    expect(addNumbers.add(-5, -3)).toEqual(-8);
    expect(addNumbers.add(-0, -3)).toEqual(-3);
  });

  it('should handle zero as an input', () => {
    expect(addNumbers.add(0, 3)).toEqual(3);
    expect(addNumbers.add(-3, 0)).toEqual(-3);
    expect(addNumbers.add(0, 0)).toEqual(0);
  });

  it('should handle empty inputs', () => {
    expect(addNumbers.add(undefined, undefined)).toEqual(undefined);
    expect(addNumbers.add(null, null)).toEqual(null);
    expect(addNumbers.add(NaN, NaN)).toEqual(NaN);
    expect(addNumbers.add(Infinity, Infinity)).toEqual(Infinity);
    expect(addNumbers.add(-Infinity, -Infinity)).toEqual(-Infinity);
  });

  it('should handle inputs that are not numbers', () => {
    expect(() => addNumbers.add('a', 3)).toThrow('Input must be a number');
    expect(() => addNumbers.add(3, 'a')).toThrow('Input must be a number');
    expect(() => addNumbers.add({}, 3)).toThrow('Input must be a number');
    expect(() => addNumbers.add(function () {}, 3)).toThrow('Input must be a number');
  });

  it('should handle large numbers', () => {
    const largeNumber1 = Math.pow(2, 53) - 1;
    const largeNumber2 = Math.pow(2, 53);
    expect(addNumbers.add(largeNumber1, 1)).toEqual(largeNumber2);
  });

  it('should handle NaN as an input', () => {
    expect(addNumbers.add(NaN, 3)).toEqual(NaN);
    expect(addNumbers.add(3, NaN)).toEqual(NaN);
  });

  it('should handle Infinity as an input', () => {
    expect(addNumbers.add(Infinity, 3)).toEqual(Infinity);
    expect(addNumbers.add(-Infinity, 3)).toEqual(-Infinity);
    expect(addNumbers.add(3, Infinity)).toEqual(Infinity);
    expect(addNumbers.add(3, -Infinity)).toEqual(-Infinity);
  });

  it('should handle large negative numbers', () => {
    const largeNegativeNumber = -Math.pow(2, 53) + 1;
    expect(addNumbers.add(largeNegativeNumber, 1)).toEqual(largeNegativeNumber - 1);
  });

  it('should handle very large numbers', () => {
    const veryLargeNumber1 = Math.pow(2, 1024) - 1;
    const veryLargeNumber2 = Math.pow(2, 1024);
    expect(addNumbers.add(veryLargeNumber1, 1)).toEqual(veryLargeNumber2);
  });

  it('should handle very small numbers', () => {
    const verySmallNumber1 = 2 ** -1024;
    const verySmallNumber2 = 2 ** -1023;
    expect(addNumbers.add(verySmallNumber1, verySmallNumber2)).toEqual(verySmallNumber1 * 2);
  });

  it('should return a number', () => {
    expectTypeOf(addNumbers.add(2, 3)).toBeTypeOf('number');
  });

  // Accessibility test for screen reader tools
  describe('Accessible AddNumbersFunction', () => {
    it('should provide a meaningful name for the AddNumbersFunction', () => {
      expect(addNumbers).toHaveProperty('name', 'AddNumbersFunction');
    });

    it('should provide a meaningful string representation for the AddNumbersFunction', () => {
      expect(addNumbers.toString()).toMatch(/AddNumbersFunction\((.+?)\)/);
    });

    it('should provide a meaningful JSON representation for the AddNumbersFunction', () => {
      expect(JSON.stringify(addNumbers)).toMatch(/AddNumbersFunction\((.+?)\)/);
    });

    it('should provide a meaningful name property for the AddNumbersFunction', () => {
      expect(addNumbers.name).toEqual('AddNumbersFunction');
    });

    it('should provide a meaningful displayName property for the AddNumbersFunction', () => {
      expect(addNumbers.displayName).toEqual('AddNumbersFunction');
    });

    it('should provide a constructor property for the AddNumbersFunction', () => {
      expect(addNumbers.constructor).toEqual(AddNumbersFunction);
    });

    it('should provide a prototype property for the AddNumbersFunction', () => {
      expect(addNumbers.prototype).toEqual(AddNumbersFunction.prototype);
    });

    it('should provide a length property for the AddNumbersFunction', () => {
      expect(addNumbers.length).toEqual(2);
    });
  });
});