class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive numbers.");
    }
    this.width = width;
    this.height = height;
  }

  public getArea(): number {
    return this.width * this.height;
  }
}

// Usage example
const rectangle = new Rectangle(5, 10);
console.log(rectangle.getArea()); // Output: 50

class Rectangle {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive numbers.");
    }
    this.width = width;
    this.height = height;
  }

  public getArea(): number {
    return this.width * this.height;
  }
}

// Usage example
const rectangle = new Rectangle(5, 10);
console.log(rectangle.getArea()); // Output: 50