import { assert, isNumber } from 'assert';

export type RectangleDimensions = {
  width: number;
  height: number;
};

/**
 * Validate the input parameters and throw an error if they are invalid
 * @param dimensions The dimensions of the rectangle
 */
export function validateRectangleDimensions(dimensions: RectangleDimensions): void {
  assert(isNumber(dimensions.width), 'Width must be a number');
  assert(isNumber(dimensions.height), 'Height must be a number');

  if (dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error('Invalid input parameters. Width and height must be positive numbers.');
  }
}

/**
 * Calculate the area of a rectangle
 * @param dimensions The dimensions of the rectangle
 */
export function calculateRectangleArea(dimensions: RectangleDimensions): number {
  validateRectangleDimensions(dimensions);

  // Calculate the area
  const area = dimensions.width * dimensions.height;

  // Optimize performance by using BigInt for large numbers
  if (area > Number.MAX_SAFE_INTEGER) {
    return BigInt(dimensions.width) * BigInt(dimensions.height);
  }

  return area;
}

/**
 * Calculate the perimeter of a rectangle
 * @param dimensions The dimensions of the rectangle
 */
export function calculateRectanglePerimeter(dimensions: RectangleDimensions): number {
  validateRectangleDimensions(dimensions);

  // Calculate the perimeter
  const perimeter = 2 * (dimensions.width + dimensions.height);

  return perimeter;
}

// Improve maintainability by adding unit tests
import { describe, it, expect } from 'vitest';

describe('calculateRectangleArea', () => {
  it('should return the correct area for a valid rectangle', () => {
    expect(calculateRectangleArea({ width: 5, height: 10 })).toEqual(50);
  });

  it('should throw an error for an invalid rectangle', () => {
    expect(() => calculateRectangleArea({ width: 0, height: 10 })).toThrow('Invalid input parameters. Width and height must be positive numbers.');
  });

  it('should return the correct area for a large rectangle using BigInt', () => {
    const largeWidth = Number.MAX_SAFE_INTEGER + 1;
    const largeHeight = Number.MAX_SAFE_INTEGER + 1;
    expect(calculateRectangleArea({ width: largeWidth, height: largeHeight })).toEqual(BigInt(largeWidth) * BigInt(largeHeight));
  });
});

describe('calculateRectanglePerimeter', () => {
  it('should return the correct perimeter for a valid rectangle', () => {
    expect(calculateRectanglePerimeter({ width: 5, height: 10 })).toEqual(30);
  });

  it('should throw an error for an invalid rectangle', () => {
    expect(() => calculateRectanglePerimeter({ width: 0, height: 10 })).toThrow('Invalid input parameters. Width and height must be positive numbers.');
  });
});