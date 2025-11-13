import { expect } from 'chai';

function addTwoNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context (not applicable in this case)

  // Apply security best practices (not applicable in this case)

  // Optimize performance (not applicable in this case)

  // Improve maintainability
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be valid numbers.');
  }

  if (num1 === Infinity || num2 === Infinity) {
    throw new Error('Cannot add Infinity to a number.');
  }

  if (num1 < 0 || num2 < 0) {
    throw new Error('Both arguments must be non-negative numbers.');
  }

  return num1 + num2;
}

describe('addTwoNumbers', () => {
  it('should add two numbers correctly', () => {
    expect(addTwoNumbers(2, 3)).to.equal(5);
    expect(addTwoNumbers(-2, -3)).to.equal(-5);
    expect(addTwoNumbers(2, -3)).to.equal(-1);
    expect(addTwoNumbers(0, 0)).to.equal(0);
    expect(addTwoNumbers(0, 3)).to.equal(3);
    expect(addTwoNumbers(0, -3)).to.equal(-3);
    expect(addTwoNumbers(9007199254740991, 1)).to.equal(9007199254740992);
    expect(addTwoNumbers(-9007199254740991, 1)).to.equal(-9007199254740990);
    expect(addTwoNumbers(9007199254740991, -1)).to.equal(9007199254740990);
    expect(addTwoNumbers(-9007199254740991, -1)).to.equal(-9007199254740990);
    expect(addTwoNumbers(9007199254740991, Infinity)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(Infinity, 9007199254740991)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(9007199254740991, -Infinity)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(-Infinity, 9007199254740991)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(9007199254740991, NaN)).to.throw('Both arguments must be valid numbers.');
    expect(addTwoNumbers(NaN, 9007199254740991)).to.throw('Both arguments must be valid numbers.');
    expect(addTwoNumbers(9007199254740991, undefined)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(undefined, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, null)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(null, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, 'string')).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers('string', 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, true)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(true, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, [1, 2, 3])).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers([1, 2, 3], 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, { key: 'value' })).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers({ key: 'value' }, 9007199254740991)).to.throw('Both arguments must be numbers.');
  });
});

import { expect } from 'chai';

function addTwoNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context (not applicable in this case)

  // Apply security best practices (not applicable in this case)

  // Optimize performance (not applicable in this case)

  // Improve maintainability
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be valid numbers.');
  }

  if (num1 === Infinity || num2 === Infinity) {
    throw new Error('Cannot add Infinity to a number.');
  }

  if (num1 < 0 || num2 < 0) {
    throw new Error('Both arguments must be non-negative numbers.');
  }

  return num1 + num2;
}

describe('addTwoNumbers', () => {
  it('should add two numbers correctly', () => {
    expect(addTwoNumbers(2, 3)).to.equal(5);
    expect(addTwoNumbers(-2, -3)).to.equal(-5);
    expect(addTwoNumbers(2, -3)).to.equal(-1);
    expect(addTwoNumbers(0, 0)).to.equal(0);
    expect(addTwoNumbers(0, 3)).to.equal(3);
    expect(addTwoNumbers(0, -3)).to.equal(-3);
    expect(addTwoNumbers(9007199254740991, 1)).to.equal(9007199254740992);
    expect(addTwoNumbers(-9007199254740991, 1)).to.equal(-9007199254740990);
    expect(addTwoNumbers(9007199254740991, -1)).to.equal(9007199254740990);
    expect(addTwoNumbers(-9007199254740991, -1)).to.equal(-9007199254740990);
    expect(addTwoNumbers(9007199254740991, Infinity)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(Infinity, 9007199254740991)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(9007199254740991, -Infinity)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(-Infinity, 9007199254740991)).to.throw('Cannot add Infinity to a number.');
    expect(addTwoNumbers(9007199254740991, NaN)).to.throw('Both arguments must be valid numbers.');
    expect(addTwoNumbers(NaN, 9007199254740991)).to.throw('Both arguments must be valid numbers.');
    expect(addTwoNumbers(9007199254740991, undefined)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(undefined, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, null)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(null, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, 'string')).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers('string', 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, true)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(true, 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, [1, 2, 3])).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers([1, 2, 3], 9007199254740991)).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers(9007199254740991, { key: 'value' })).to.throw('Both arguments must be numbers.');
    expect(addTwoNumbers({ key: 'value' }, 9007199254740991)).to.throw('Both arguments must be numbers.');
  });
});