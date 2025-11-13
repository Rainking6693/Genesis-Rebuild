interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categories: string[];

  // Method to check if product is in stock
  isInStock(): boolean;

  // Method to update product stock when an order is placed
  decreaseStock(quantity: number): void;

  // Method to check if the product belongs to a specific category
  belongsToCategory(category: string): boolean;

  // Method to get the product's accessible name for screen readers
  getAccessibleName(): string;
}

// Implementation of the Product interface
class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categories: string[];

  constructor(productData: Partial<IProduct>) {
    this.id = productData.id || '';
    this.name = productData.name || '';
    this.description = productData.description || '';
    this.price = productData.price || 0;
    this.stock = productData.stock || 0;
    this.imageUrl = productData.imageUrl || '';
    this.categories = productData.categories || [];
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Invalid quantity');
    }

    this.stock -= quantity;
  }

  belongsToCategory(category: string): boolean {
    return this.categories.includes(category);
  }

  getAccessibleName(): string {
    return `${this.name} - ${this.price} $`;
  }
}

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categories: string[];

  // Method to check if product is in stock
  isInStock(): boolean;

  // Method to update product stock when an order is placed
  decreaseStock(quantity: number): void;

  // Method to check if the product belongs to a specific category
  belongsToCategory(category: string): boolean;

  // Method to get the product's accessible name for screen readers
  getAccessibleName(): string;
}

// Implementation of the Product interface
class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categories: string[];

  constructor(productData: Partial<IProduct>) {
    this.id = productData.id || '';
    this.name = productData.name || '';
    this.description = productData.description || '';
    this.price = productData.price || 0;
    this.stock = productData.stock || 0;
    this.imageUrl = productData.imageUrl || '';
    this.categories = productData.categories || [];
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Invalid quantity');
    }

    this.stock -= quantity;
  }

  belongsToCategory(category: string): boolean {
    return this.categories.includes(category);
  }

  getAccessibleName(): string {
    return `${this.name} - ${this.price} $`;
  }
}