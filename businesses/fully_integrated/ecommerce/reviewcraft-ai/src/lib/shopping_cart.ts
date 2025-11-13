import { CartItem } from './CartItem';

export class ShoppingCart {
  private items: CartItem[] = [];

  public addItem(item: CartItem): void {
    const existingItem = this.items.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  public removeItem(itemId: number): void {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public getTotalCost(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Edge case handling for adding items with zero or negative quantities
  public addItemSafe(item: CartItem): void {
    if (item.quantity <= 0) {
      throw new Error('Invalid quantity. Quantity must be greater than zero.');
    }
    this.addItem(item);
  }

  // Accessibility improvements for getting items
  public getItemsAccessible(): string {
    return this.items.map((item) => item.toAccessibleString()).join(', ');
  }

  // Maintainability improvements for removing items by index
  public removeItemByIndex(index: number): void {
    if (index < 0 || index >= this.items.length) {
      throw new Error('Invalid index. Index must be within the range of items.');
    }
    this.items.splice(index, 1);
  }
}

import { CartItem } from './CartItem';

export class ShoppingCart {
  private items: CartItem[] = [];

  public addItem(item: CartItem): void {
    const existingItem = this.items.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  public removeItem(itemId: number): void {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public getTotalCost(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Edge case handling for adding items with zero or negative quantities
  public addItemSafe(item: CartItem): void {
    if (item.quantity <= 0) {
      throw new Error('Invalid quantity. Quantity must be greater than zero.');
    }
    this.addItem(item);
  }

  // Accessibility improvements for getting items
  public getItemsAccessible(): string {
    return this.items.map((item) => item.toAccessibleString()).join(', ');
  }

  // Maintainability improvements for removing items by index
  public removeItemByIndex(index: number): void {
    if (index < 0 || index >= this.items.length) {
      throw new Error('Invalid index. Index must be within the range of items.');
    }
    this.items.splice(index, 1);
  }
}