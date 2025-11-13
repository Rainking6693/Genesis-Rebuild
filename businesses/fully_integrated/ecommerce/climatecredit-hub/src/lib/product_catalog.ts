import { validateRectangleInput } from './input_validation';

export type Rectangle = {
  length: number;
  width: number;
};

export type CalculateRectangleAreaError = {
  message: string;
};

export type ValidatedRectangle = Rectangle & { isValid: true };
export type InvalidRectangle = Rectangle & { isValid: false; error: CalculateRectangleAreaError };

export function validateRectangleInput(length: number, width: number): Rectangle | null {
  if (length <= 0 || width <= 0) {
    return null;
  }

  return { length, width, isValid: true };
}

export function validateRectangle(input: Rectangle): ValidatedRectangle | InvalidRectangle {
  if (!input.isValid) {
    return { ...input, error: { message: 'Invalid input for rectangle area calculation. Input is not a valid rectangle.' } };
  }

  if (input.length <= 0 || input.width <= 0) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be greater than 0.' } };
  }

  if (isNaN(input.length) || isNaN(input.width)) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be numbers.' } };
  }

  if (!Number.isFinite(input.length) || !Number.isFinite(input.width)) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be finite numbers.' } };
  }

  return input;
}

export function calculateRectangleArea(input: Rectangle): number | CalculateRectangleAreaError {
  const validatedInput = validateRectangle(input);

  if (validatedInput.isValid) {
    const area = validatedInput.length * validatedInput.width;
    return area;
  }

  return validatedInput.error;
}

import { validateRectangleInput } from './input_validation';

export type Rectangle = {
  length: number;
  width: number;
};

export type CalculateRectangleAreaError = {
  message: string;
};

export type ValidatedRectangle = Rectangle & { isValid: true };
export type InvalidRectangle = Rectangle & { isValid: false; error: CalculateRectangleAreaError };

export function validateRectangleInput(length: number, width: number): Rectangle | null {
  if (length <= 0 || width <= 0) {
    return null;
  }

  return { length, width, isValid: true };
}

export function validateRectangle(input: Rectangle): ValidatedRectangle | InvalidRectangle {
  if (!input.isValid) {
    return { ...input, error: { message: 'Invalid input for rectangle area calculation. Input is not a valid rectangle.' } };
  }

  if (input.length <= 0 || input.width <= 0) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be greater than 0.' } };
  }

  if (isNaN(input.length) || isNaN(input.width)) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be numbers.' } };
  }

  if (!Number.isFinite(input.length) || !Number.isFinite(input.width)) {
    return { ...input, isValid: false, error: { message: 'Invalid input for rectangle area calculation. Both length and width must be finite numbers.' } };
  }

  return input;
}

export function calculateRectangleArea(input: Rectangle): number | CalculateRectangleAreaError {
  const validatedInput = validateRectangle(input);

  if (validatedInput.isValid) {
    const area = validatedInput.length * validatedInput.width;
    return area;
  }

  return validatedInput.error;
}