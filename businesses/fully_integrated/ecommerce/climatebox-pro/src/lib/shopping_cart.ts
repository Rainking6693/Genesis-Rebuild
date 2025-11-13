import { CartItem } from './CartItem';

export class ShoppingCart {
  private items: CartItem[] = [];

  constructor(private currency: string = 'USD') {}

  addItem(item: CartItem): void {
    const existingItem = this.items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalCost(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Accessibility: Add ARIA attributes for screen readers
  getTotalCostAriaLabel(): string {
    return `Total cost in ${this.currency}: ${this.getTotalCost().toFixed(2)}`;
  }

  // Maintainability: Add a method to clear the cart
  clearCart(): void {
    this.items = [];
  }
}

import { CartItem } from './CartItem';

export class ShoppingCart {
  private items: CartItem[] = [];

  constructor(private currency: string = 'USD') {}

  addItem(item: CartItem): void {
    const existingItem = this.items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalCost(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Accessibility: Add ARIA attributes for screen readers
  getTotalCostAriaLabel(): string {
    return `Total cost in ${this.currency}: ${this.getTotalCost().toFixed(2)}`;
  }

  // Maintainability: Add a method to clear the cart
  clearCart(): void {
    this.items = [];
  }
}