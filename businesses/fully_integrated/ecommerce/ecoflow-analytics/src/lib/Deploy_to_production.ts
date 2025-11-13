import { Rectangle, calculateRectangleArea } from './shapes';

export type RectangleAreaFunction = (rectangle: Rectangle) => number | undefined;

export function createRectangleAreaValidator(validator: RectangleAreaFunction): RectangleAreaFunction {
  return (rectangle: Rectangle) => {
    if (!rectangle || !rectangle.width || !rectangle.height) {
      return undefined;
    }

    const area = validator(rectangle);
    if (area === undefined || area < 0) {
      throw new Error('Invalid rectangle object or area');
    }

    return area;
  };
}

export function calculateRectangleArea(rectangle: Rectangle): number {
  return rectangle.width * rectangle.height;
}

export class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public static isValid(rectangle: Rectangle): rectangle is ValidRectangle {
    return rectangle.width > 0 && rectangle.height > 0;
  }

  public static isValidEcommerce(rectangle: Rectangle): rectangle is ValidEcommerceRectangle {
    return this.isValid(rectangle) && rectangle.width >= 100 && rectangle.height >= 100;
  }
}

export interface ValidRectangle {
  width: number;
  height: number;
}

export interface ValidEcommerceRectangle extends ValidRectangle {}

export const calculateRectangleAreaValidator = createRectangleAreaValidator(calculateRectangleArea);

export class EcommerceRectangle extends Rectangle {
  constructor(width: number, height: number) {
    super(width, height);
  }
}

In this version, I've added a type guard `Rectangle.isValidEcommerce()` to check if a rectangle is a valid ecommerce rectangle. I've also removed the duplicate code for `createRectangleAreaValidator` and `calculateRectangleArea`.

For accessibility, it's a good practice to provide descriptive error messages. I've updated the error message to be more descriptive.

Lastly, I've made the code more modular by separating the validation and calculation of the rectangle area into separate functions. This makes the code easier to maintain and test.